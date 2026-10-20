import { createIfNotExists, defineMigration } from "sanity/migrate";

/**
 * A privacy policy page built with the Rich content section. It doubles as a showcase of
 * every rich-text feature: headings, nested and numbered lists, quotes, links and inline marks.
 * Never overwrites: the page is only created if missing.
 *
 * Preview:  npx sanity migrations run privacy-page
 * Apply:    npx sanity migrations run privacy-page --no-dry-run
 */

type Span = string | { text: string; marks: string[] };
type Options = { style?: string; list?: "bullet" | "number"; level?: number; links?: Record<string, string> };

let counter = 0;
const key = () => `k${(counter++).toString(36)}`;

/** One Portable Text block. Spans are plain strings or { text, marks }; marks can name a link from `links`. */
function block(spans: Span[], { style = "normal", list, level, links = {} }: Options = {}) {
  const markDefs = Object.entries(links).map(([name, href]) => ({ _key: name, _type: "link", href, blank: href.startsWith("http") }));
  return {
    _key: key(),
    _type: "block",
    style,
    ...(list && { listItem: list, level: level ?? 1 }),
    markDefs,
    children: spans.map((span) => ({ _key: key(), _type: "span", ...(typeof span === "string" ? { text: span, marks: [] } : span) })),
  };
}

const ar = [
  block(["نحترم خصوصيتك. توضح هذه الصفحة ", { text: "ما نجمعه", marks: ["strong"] }, " من بيانات و", { text: "كيف نستخدمه", marks: ["em"] }, "."]),
  block(["البيانات التي نجمعها"], { style: "h2" }),
  block(["بيانات التواصل التي ترسلها لنا بنفسك:"]),
  block(["الاسم والبريد الإلكتروني"], { list: "bullet" }),
  block(["تفاصيل مشروعك"], { list: "bullet" }),
  block(["الميزانية والمدة المتوقعة"], { list: "bullet", level: 2 }),
  block(["بيانات الاستخدام المجهولة عبر Google Analytics."], { list: "bullet" }),
  block(["كيف نستخدم بياناتك"], { style: "h2" }),
  block(["للرد على استفسارك."], { list: "number" }),
  block(["لتحسين الموقع وتجربة الاستخدام."], { list: "number" }),
  block(["لا نبيع بياناتك ولا نشاركها مع أي طرف ثالث لأغراض تسويقية."], { style: "blockquote" }),
  block(["حقوقك"], { style: "h3" }),
  block(["يمكنك طلب حذف بياناتك في أي وقت عبر ", { text: "صفحة التواصل", marks: ["contact"] }, " أو بمراسلتنا على ", { text: "privacy@example.com", marks: ["code"] }, "."], { links: { contact: "/about" } }),
];

const en = [
  block(["We respect your privacy. This page explains ", { text: "what we collect", marks: ["strong"] }, " and ", { text: "how we use it", marks: ["em"] }, "."]),
  block(["Data we collect"], { style: "h2" }),
  block(["Contact details you send us yourself:"]),
  block(["Your name and email address"], { list: "bullet" }),
  block(["Details about your project"], { list: "bullet" }),
  block(["Budget and expected timeline"], { list: "bullet", level: 2 }),
  block(["Anonymous usage data through Google Analytics."], { list: "bullet" }),
  block(["How we use your data"], { style: "h2" }),
  block(["To reply to your inquiry."], { list: "number" }),
  block(["To improve the site and its experience."], { list: "number" }),
  block(["We never sell your data or share it with third parties for marketing."], { style: "blockquote" }),
  block(["Your rights"], { style: "h3" }),
  block(["You can ask us to delete your data at any time through the ", { text: "contact page", marks: ["contact"] }, " or by writing to ", { text: "privacy@example.com", marks: ["code"] }, "."], { links: { contact: "/about" } }),
];

export default defineMigration({
  title: "Add a privacy policy page (Rich content showcase)",
  async *migrate() {
    yield createIfNotExists({
      _id: "page-privacy",
      _type: "page",
      title: { ar: "سياسة الخصوصية", en: "Privacy policy" },
      slug: { _type: "slug", current: "privacy" },
      sections: [{ _key: "content", _type: "richContent", heading: { ar: "سياسة الخصوصية", en: "Privacy policy" }, body: { ar, en } }],
      seo: {
        description: {
          ar: "كيف نجمع بياناتك ونستخدمها ونحميها، وما هي حقوقك.",
          en: "How we collect, use and protect your data, and what your rights are.",
        },
      },
    });
  },
});
