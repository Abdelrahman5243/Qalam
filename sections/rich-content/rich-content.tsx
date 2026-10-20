import type { SectionProps } from "@/cms/define";
import { RichText } from "@/components/ui/rich-text";
import { Section } from "@/components/ui/section";
import type { richContent } from "./schema";
import styles from "./rich-content.module.css";

export function RichContent({ heading, body }: SectionProps<typeof richContent>) {
  return (
    <Section heading={heading}>
      <RichText className={styles.body} value={body} />
    </Section>
  );
}
