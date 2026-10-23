import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const dataset = process.argv[2] || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const date = new Date().toISOString().slice(0, 10);
const backupDir = path.resolve("backups");
const destination = path.join(backupDir, `cms-${dataset}-${date}.tar.gz`);

await mkdir(backupDir, { recursive: true });

console.log(`Exporting Sanity dataset "${dataset}"...`);
console.log(`Destination: ${destination}`);

const command = process.platform === "win32" ? "npx.cmd" : "npx";
const child = spawn(
  command,
  ["sanity", "datasets", "export", dataset, destination, "--overwrite"],
  { stdio: "inherit", shell: false },
);

child.on("error", (error) => {
  console.error("Could not start the Sanity export:", error.message);
  process.exitCode = 1;
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`Sanity export stopped by signal ${signal}.`);
    process.exitCode = 1;
  } else {
    process.exitCode = code ?? 1;
  }
});
