"use client";

import { useSyncExternalStore } from "react";
import { VisualEditing as SanityVisualEditing } from "next-sanity/visual-editing";

const subscribe = () => () => {};
const getSnapshot = () => window.parent !== window;
const getServerSnapshot = () => false;

export function VisualEditing() {
  const isPreviewFrame = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return isPreviewFrame ? <SanityVisualEditing /> : null;
}
