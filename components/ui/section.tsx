import type { ReactNode } from "react";
import styles from "./section.module.css";

type Props = { heading?: string | null; intro?: string | null; className?: string; children?: ReactNode };

/** Standard section frame: centered container with an optional heading and intro. */
export function Section({ heading, intro, className, children }: Props) {
  return (
    <section className={`${styles.section} ${className ?? ""}`}>
      {(heading || intro) && (
        <header className={styles.header}>
          {heading && <h2>{heading}</h2>}
          {intro && <p>{intro}</p>}
        </header>
      )}
      {children}
    </section>
  );
}
