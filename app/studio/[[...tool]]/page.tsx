"use client";

import dynamic from "next/dynamic";

import config from "../../../sanity.config";
import styles from "./studio.module.css";

const NextStudio = dynamic(
  () => import("next-sanity/studio").then((module) => module.NextStudio),
  { ssr: false },
);

export default function StudioPage() {
  return (
    <div className={styles.shell}>
      <NextStudio config={config} />
    </div>
  );
}
