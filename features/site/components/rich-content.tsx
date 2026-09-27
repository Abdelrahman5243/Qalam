import type { ReactNode } from "react";
import type { RichTextBlock } from "@/features/services/types";

function blockContent(block: RichTextBlock): ReactNode {
  return <>{(block.children || []).map((child, childIndex) => <span key={childIndex} className={child.marks?.includes("strong") ? "rich-strong" : child.marks?.includes("em") ? "rich-em" : undefined}>{child.text}</span>)}</>;
}

export function RichContent({ blocks, locale }: { blocks: RichTextBlock[]; locale: "ar" | "en" }) {
  if (!blocks.length) return null;
  const rendered: ReactNode[] = [];
  let index = 0;
  while (index < blocks.length) {
    const block = blocks[index];
    const text = (block.children || []).map((child) => child.text || "").join("");
    if (!text) { index += 1; continue; }
    if (block.listItem) {
      const listType = block.listItem === "number" ? "ol" : "ul";
      const items: ReactNode[] = [];
      while (index < blocks.length && blocks[index].listItem === block.listItem) {
        const item = blocks[index];
        items.push(<li key={index}>{blockContent(item)}</li>);
        index += 1;
      }
      const List = listType;
      rendered.push(<List key={`list-${index}`}><>{items}</></List>);
      continue;
    }
    const content = blockContent(block);
    if (block.style === "h2") rendered.push(<h2 key={index}>{content}</h2>);
    else if (block.style === "h3") rendered.push(<h3 key={index}>{content}</h3>);
    else if (block.style === "blockquote") rendered.push(<blockquote key={index}>{content}</blockquote>);
    else rendered.push(<p key={index}>{content}</p>);
    index += 1;
  }
  return <div className="rich-content" dir={locale === "ar" ? "rtl" : "ltr"}>{rendered}</div>;
}
