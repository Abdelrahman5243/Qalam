import type { LucideIcon } from "lucide-react";
import type { Link } from "@/cms/define";

type Props = { link: Link | null; className?: string; icon?: LucideIcon };

/** A link styled as a button. Renders nothing until the editor gives it a label. */
export function ButtonLink({ link, className, icon: Icon }: Props) {
  if (!link?.label) return null;
  return (
    <a className={className} href={link.href ?? "#"}>
      {link.label}
      {Icon && <Icon aria-hidden size={16} />}
    </a>
  );
}
