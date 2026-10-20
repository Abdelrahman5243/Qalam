import {
  ArrowDown,
  AtSign,
  BriefcaseBusiness,
  Code2,
  ExternalLink,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import type { SectionProps } from "@/cms/define";
import { ButtonLink } from "@/components/ui/button-link";
import { RichText } from "@/components/ui/rich-text";
import type { hero } from "./schema";
import styles from "./hero.module.css";

const socialIcons = {
  email: Mail,
  linkedin: BriefcaseBusiness,
  message: MessageCircle,
  github: AtSign,
  code: Code2,
  globe: Globe2,
};

export function Hero({
  status,
  headline,
  role,
  location,
  description,
  primaryButton,
  secondaryButton,
  socials,
  locale,
  edit,
}: SectionProps<typeof hero>) {
  return (
    <section className={styles.hero}>
      {status && (
        <p className={styles.status}>
          <span />
          {status}
        </p>
      )}
      {headline && <h1>{headline}</h1>}
      {role && <h2>{role}</h2>}
      {location && (
        <p className={styles.location}>
          <MapPin aria-hidden size={15} /> {location}
        </p>
      )}
      <RichText className={styles.description} value={description} />

      <div className={styles.actions}>
        <ButtonLink
          className={styles.primaryButton}
          link={primaryButton}
          icon={ArrowDown}
        />
        <ButtonLink
          className={styles.secondaryButton}
          link={secondaryButton}
          icon={ExternalLink}
        />
      </div>

      {!!socials?.length && (
        <nav
          className={styles.socials}
          aria-label={locale === "ar" ? "روابط التواصل" : "Social links"}
        >
          {socials.map(({ _key, icon, label, url }) => {
            const Icon =
              socialIcons[icon as keyof typeof socialIcons] ?? Globe2;
            return (
              <a
                key={_key}
                href={url ?? "#"}
                aria-label={label ?? icon ?? undefined}
                data-sanity={edit("socials", { _key })}
              >
                <Icon aria-hidden size={22} strokeWidth={1.8} />
              </a>
            );
          })}
        </nav>
      )}
    </section>
  );
}
