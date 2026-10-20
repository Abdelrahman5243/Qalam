import type { ComponentType } from "react";
import type { Data, SectionProps } from "@/cms/define";
import { createEdit } from "@/cms/edit";
import type { Page } from "@/cms/sanity";
import type { Locale } from "@/lib/i18n";
import type { sections } from ".";
import { Cta } from "./cta/cta";
import { Faq } from "./faq/faq";
import { Features } from "./features/features";
import { Hero } from "./hero/hero";
import { TextImage } from "./text-image/text-image";

type Section = (typeof sections)[number];

/** A section as stored on a page: its fields plus Sanity's `_type` and `_key`. */
export type SectionData = {
  [S in Section as S["name"]]: Data<S["fields"]> & {
    _type: S["name"];
    _key: string;
  };
}[Section["name"]];

/** Section name → component. TypeScript fails here if a registered section has no component. */
const components: {
  [S in Section as S["name"]]: ComponentType<SectionProps<S>>;
} = {
  hero: Hero,
  features: Features,
  textImage: TextImage,
  faq: Faq,
  cta: Cta,
};

type Props = { page: Page; locale: Locale; isDraftMode: boolean };

export function Sections({ page, locale, isDraftMode }: Props) {
  return page.sections?.map(({ _key, _type, ...fields }) => {
    const Component = components[_type] as
      ComponentType<SectionProps<Section>> | undefined;
    const edit = createEdit(page, ["sections", { _key }], isDraftMode);
    return (
      Component && (
        <Component key={_key} {...fields} locale={locale} edit={edit} />
      )
    );
  });
}
