import { createDataAttribute } from "next-sanity";
import { env } from "@/lib/env";

type Path = Array<string | number | { _key: string }>;

/** Returns a `data-sanity` value for a field path, or undefined outside draft mode. */
export type Edit = (...path: Path) => string | undefined;

const noEdit: Edit = () => undefined;

/**
 * Text is click-to-edit automatically (stega). Elements without visible text — icons,
 * images, icon-only links — need an explicit `data-sanity={edit("field")}` instead.
 */
export function createEdit(document: { _id: string; _type: string }, base: Path, enabled: boolean): Edit {
  const { projectId, dataset, studioUrl } = env.sanity;
  if (!enabled || !projectId) return noEdit;
  const attribute = createDataAttribute({ id: document._id, type: document._type, baseUrl: studioUrl, projectId, dataset });
  return (...path) => attribute([...base, ...path]);
}
