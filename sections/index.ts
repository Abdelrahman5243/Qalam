import { cta } from "./cta/schema";
import { faq } from "./faq/schema";
import { features } from "./features/schema";
import { hero } from "./hero/schema";
import { richContent } from "./rich-content/schema";
import { textImage } from "./text-image/schema";

/** Every section editors can add to a page. Add new sections here and in render.tsx. */
export const sections = [hero, features, textImage, richContent, faq, cta];
