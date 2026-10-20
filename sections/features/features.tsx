import type { SectionProps } from "@/cms/define";
import { Section } from "@/components/ui/section";
import type { features } from "./schema";
import styles from "./features.module.css";

export function Features({
  heading,
  intro,
  items,
}: SectionProps<typeof features>) {
  return (
    <Section heading={heading} intro={intro}>
      <ul className={styles.grid}>
        {items?.map(({ _key, title, text }) => (
          <li key={_key} className={styles.card}>
            <h3>{title}</h3>
            {text && <p>{text}</p>}
          </li>
        ))}
      </ul>
    </Section>
  );
}
