'use client';

import { useSyncExternalStore } from "react";
import { VisualEditing } from "next-sanity/visual-editing";

const subscribe = () => () => {};
const getSnapshot = () => window.parent !== window;
const getServerSnapshot = () => false;

export function SanityVisualEditing() {
  const isPreviewFrame = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return isPreviewFrame ? <VisualEditing /> : null;
}
