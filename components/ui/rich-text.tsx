import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";

const components: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => {
      const external = value?.blank;
      return (
        <a
          href={value?.href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
};

/** Rich text from the CMS. Renders nothing when empty. */
export function RichText({
  value,
  className,
}: {
  value: PortableTextBlock[] | null;
  className?: string;
}) {
  if (!value?.length) return null;
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}
