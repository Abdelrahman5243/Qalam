import { PortableText, type PortableTextBlock } from "@portabletext/react";

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
      <PortableText value={value} />
    </div>
  );
}
