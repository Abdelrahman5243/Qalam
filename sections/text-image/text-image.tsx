import Image from "next/image";
import type { SectionProps } from "@/cms/define";
import { ButtonLink } from "@/components/ui/button-link";
import { RichText } from "@/components/ui/rich-text";
import { Section } from "@/components/ui/section";
import type { textImage } from "./schema";
import styles from "./text-image.module.css";

export function TextImage({
  heading,
  body,
  image,
  imageSide,
  button,
  edit,
}: SectionProps<typeof textImage>) {
  return (
    <Section className={imageSide === "start" ? styles.imageStart : undefined}>
      <div className={styles.layout}>
        <div>
          {heading && <h2 className={styles.heading}>{heading}</h2>}
          <RichText className={styles.body} value={body} />
          <ButtonLink className={styles.button} link={button} />
        </div>
        {image && (
          <Image
            className={styles.image}
            src={image.url}
            alt={image.alt}
            width={800}
            height={600}
            data-sanity={edit("image")}
          />
        )}
      </div>
    </Section>
  );
}
