"use client";

import dynamic from "next/dynamic";

import config from "../../../sanity.config";
import styles from "./admin.module.css";

const NextStudio = dynamic(
  () => import("next-sanity/studio").then((module) => module.NextStudio),
  { ssr: false },
);

export default function AdminPage() {
  return (
    <div className={styles.shell}>
      <NextStudio config={config} />
    </div>
  );
}
