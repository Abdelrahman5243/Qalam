import { at, createIfNotExists, defineMigration, patch, setIfMissing } from "sanity/migrate";

/**
 * Example content: an About page, a Services page and a header menu.
 * Never overwrites: pages are only created if missing, and the menu only set if empty.
 *
 * Preview:  npx sanity migrations run example-pages
 * Apply:    npx sanity migrations run example-pages --no-dry-run
 */

const t = (ar: string, en: string) => ({ ar, en });

/** A localized rich text value with one paragraph per language. */
const paragraph = (key: string, ar: string, en: string) => {
  const block = (lang: string, text: string) => [
    { _key: `${key}-${lang}`, _type: "block", style: "normal", markDefs: [], children: [{ _key: `${key}-${lang}-s`, _type: "span", marks: [], text }] },
  ];
  return { ar: block("ar", ar), en: block("en", en) };
};

const slug = (current: string) => ({ _type: "slug", current });

const contactCta = {
  _key: "cta",
  _type: "cta",
  heading: t("جاهز نبدأ مشروعك؟", "Ready to start your project?"),
  text: t("احكيلي عن فكرتك وهرد عليك خلال يوم عمل.", "Tell me about your idea and I'll get back to you within one business day."),
  button: { label: t("تواصل معي", "Get in touch"), href: "mailto:hello@example.com" },
};

const about = {
  _id: "page-about",
  _type: "page",
  title: t("من أنا", "About"),
  slug: slug("about"),
  sections: [
    {
      _key: "intro",
      _type: "textImage",
      heading: t("بحب أبني واجهات سريعة وواضحة", "I build fast, clear interfaces"),
      body: paragraph(
        "intro",
        "مطور واجهات أمامية بشتغل على React وNext.js، مهتم بالأداء وتجربة المستخدم والمواقع متعددة اللغات.",
        "A front-end developer working with React and Next.js, focused on performance, user experience and multilingual sites.",
      ),
      imageSide: "end",
      button: { label: t("شوف الخدمات", "See services"), href: "/services" },
    },
    {
      _key: "values",
      _type: "features",
      heading: t("طريقة شغلي", "How I work"),
      intro: t("ثلاث حاجات بلتزم بيها في كل مشروع.", "Three things I commit to on every project."),
      items: [
        { _key: "v1", title: t("وضوح", "Clarity"), text: t("كود سهل القراءة والتعديل.", "Code that is easy to read and change.") },
        { _key: "v2", title: t("سرعة", "Speed"), text: t("صفحات سريعة ونتائج Core Web Vitals قوية.", "Fast pages and strong Core Web Vitals.") },
        { _key: "v3", title: t("تواصل", "Communication"), text: t("تحديثات منتظمة طول المشروع.", "Regular updates throughout the project.") },
      ],
    },
    contactCta,
  ],
};

const services = {
  _id: "page-services",
  _type: "page",
  title: t("الخدمات", "Services"),
  slug: slug("services"),
  sections: [
    {
      _key: "list",
      _type: "features",
      heading: t("الخدمات", "Services"),
      intro: t("من الفكرة لحد الإطلاق.", "From idea to launch."),
      items: [
        { _key: "s1", title: t("مواقع شركات", "Company websites"), text: t("مواقع ثنائية اللغة مع لوحة تحكم.", "Bilingual websites with a content dashboard.") },
        { _key: "s2", title: t("متاجر إلكترونية", "E-commerce"), text: t("متاجر سريعة ومحسّنة لمحركات البحث.", "Fast, SEO-friendly online stores.") },
        { _key: "s3", title: t("تحسين الأداء", "Performance"), text: t("تسريع المواقع الحالية وتحسين SEO.", "Speeding up existing sites and improving SEO.") },
      ],
    },
    {
      _key: "faq",
      _type: "faq",
      heading: t("أسئلة شائعة", "FAQ"),
      items: [
        { _key: "q1", question: t("المشروع بياخد قد إيه؟", "How long does a project take?"), answer: t("موقع تعريفي غالباً من أسبوعين لأربعة.", "A company site usually takes two to four weeks.") },
        { _key: "q2", question: t("هقدر أعدل المحتوى بنفسي؟", "Can I edit the content myself?"), answer: t("أيوه، من لوحة التحكم ومن غير كود.", "Yes, from the dashboard, without code.") },
      ],
    },
    contactCta,
  ],
};

const menu = [
  { _key: "home", label: t("الرئيسية", "Home"), href: "/" },
  { _key: "about", label: t("من أنا", "About"), href: "/about" },
  { _key: "services", label: t("الخدمات", "Services"), href: "/services" },
];

export default defineMigration({
  title: "Add example pages and menu",
  async *migrate() {
    yield createIfNotExists(about);
    yield createIfNotExists(services);
    yield patch("settings", at("menu", setIfMissing(menu)));
  },
});
