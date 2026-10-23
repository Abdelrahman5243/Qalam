import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import nextEnv from "@next/env";
import { createClient } from "next-sanity";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_AUTH_TOKEN;

if (!projectId || !token) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_READ_TOKEN/SANITY_AUTH_TOKEN",
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const internalKeys = new Set(["_createdAt", "_updatedAt", "_rev", "_system"]);

function portableValue(value) {
  if (Array.isArray(value)) return value.map(portableValue);
  if (!value || typeof value !== "object") return value;

  if (value._type === "slug" && typeof value.current === "string") {
    return value.current;
  }

  if (value._type === "reference" && typeof value._ref === "string") {
    return { referenceId: value._ref };
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !internalKeys.has(key))
      .map(([key, item]) => {
        if (key === "_type") return ["type", portableValue(item)];
        if (key === "_key") return ["id", portableValue(item)];
        if (key === "_ref") return ["referenceId", portableValue(item)];
        return [key, portableValue(item)];
      }),
  );
}

console.log(`Exporting dataset "${dataset}" as portable JSON...`);
let documents;

try {
  const rawDocuments = await client.fetch(
    '*[!(_type match "system.*") && !(_type match "sanity.*") && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]',
    {},
    { perspective: "published" },
  );
  documents = rawDocuments.map((document) => {
    const { _id: id, _type: type, _createdAt: createdAt, _updatedAt: updatedAt, ...data } = document;
    return {
      id,
      type,
      createdAt,
      updatedAt,
      data: portableValue(data),
    };
  });
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown error";
  throw new Error(`Could not read the Sanity dataset: ${message}`);
}
const date = new Date().toISOString().slice(0, 10);
const backupDir = path.resolve("backups");
const destination = path.join(backupDir, `cms-${dataset}-${date}.json`);

await mkdir(backupDir, { recursive: true });
await writeFile(
  destination,
  `${JSON.stringify(
    {
      format: "qalam-cms-export",
      version: 2,
      exportedAt: new Date().toISOString(),
      source: { provider: "sanity", projectId, dataset },
      documents,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

console.log(`Exported ${documents.length} documents.`);
console.log(`Destination: ${destination}`);
