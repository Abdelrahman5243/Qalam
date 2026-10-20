import Image from "next/image";
import { PortableText, type PortableTextBlock, type PortableTextComponents } from "@portabletext/react";
import type { Image as ImageData } from "@/cms/define";
import styles from "./rich-text.module.css";

const components: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => {
      const newTab = value?.blank;
      return (
        <a href={value?.href} target={newTab ? "_blank" : undefined} rel={newTab ? "noopener noreferrer" : undefined}>
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }: { value: ImageData }) =>
      value?.url ? (
        <figure>
          <Image src={value.url} alt={value.alt} width={1200} height={800} sizes="(max-width: 800px) 100vw, 800px" />
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      ) : null,
  },
};

/**
 * Rich text from the CMS: headings, lists, quotes, links, inline marks and images.
 * Always styled (Tailwind resets lists and headings); `className` adds section-specific tweaks.
 * Renders nothing when empty.
 */
export function RichText({ value, className }: { value: PortableTextBlock[] | null; className?: string }) {
  if (!value?.length) return null;
  return (
    <div className={className ? `${styles.prose} ${className}` : styles.prose}>
      <PortableText value={value} components={components} />
    </div>
  );
}
