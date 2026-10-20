import type { SectionProps } from "@/cms/define";
import { Section } from "@/components/ui/section";
import type { faq } from "./schema";
import styles from "./faq.module.css";

export function Faq({ heading, items }: SectionProps<typeof faq>) {
  return (
    <Section heading={heading}>
      <div className={styles.list}>
        {items?.map(({ _key, question, answer }) => (
          <details key={_key} className={styles.item}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
