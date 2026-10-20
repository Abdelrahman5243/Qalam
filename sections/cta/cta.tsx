import { ArrowLeft } from "lucide-react";
import type { SectionProps } from "@/cms/define";
import { ButtonLink } from "@/components/ui/button-link";
import { Section } from "@/components/ui/section";
import type { cta } from "./schema";
import styles from "./cta.module.css";

export function Cta({ heading, text, button }: SectionProps<typeof cta>) {
  return (
    <Section>
      <div className={styles.box}>
        {heading && <h2>{heading}</h2>}
        {text && <p>{text}</p>}
        <ButtonLink className={styles.button} link={button} icon={ArrowLeft} />
      </div>
    </Section>
  );
}
