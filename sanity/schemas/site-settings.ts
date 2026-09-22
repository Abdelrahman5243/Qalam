import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "branding", title: "Branding / الهوية البصرية", default: true },
    { name: "company", title: "Company / الشركة" },
    { name: "contact", title: "Contact / التواصل" },
    { name: "seo", title: "SEO & sharing / الظهور والمشاركة" },
    { name: "social", title: "Social links / روابط التواصل" },
  ],
  fields: [
    defineField({
      name: "logo",
      title: "Header logo / شعار الهيدر",
      description:
        "الشعار الأفقي الفاتح فوق الخلفية الخضراء الداكنة. يستخدم في Desktop.",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      group: "branding",
    }),
    defineField({
      name: "mobileLogo",
      title: "Mobile logo / شعار الموبايل",
      description:
        "اختياري: أيقونة مختصرة فاتحة للموبايل. اتركه فارغًا لاستخدام icon-light.svg المحلي تلقائيًا.",
      type: "image",
      options: { hotspot: true },
      group: "branding",
    }),
    defineField({
      name: "footerLogo",
      title: "Footer logo / شعار الفوتر",
      description:
        "اختياري: الشعار الرأسي الفاتح فوق الخلفية الداكنة. اتركه فارغًا لاستخدام logo-stacked-light.svg المحلي تلقائيًا.",
      type: "image",
      options: { hotspot: true },
      group: "branding",
    }),
    defineField({
      name: "companyName",
      title: "Company name / اسم الشركة",
      description: "يظهر في العناوين، الفوتر وبيانات SEO.",
      type: "localizedString",
      group: "company",
    }),
    defineField({
      name: "phone",
      title: "Phone / الهاتف",
      description:
        "يستخدم في أزرار الاتصال وبيانات التواصل في الفوتر وصفحة تواصل معنا.",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp URL / رابط واتساب",
      description: "يستخدم في أزرار واتساب في الهيدر/الفوتر وصفحة تواصل معنا.",
      type: "url",
      group: "contact",
    }),
    defineField({
      name: "email",
      title: "Email / البريد الإلكتروني",
      description: "يظهر كرابط بريد في الفوتر وصفحة تواصل معنا.",
      type: "email",
      group: "contact",
    }),
    defineField({
      name: "address",
      title: "Address / العنوان",
      description: "يظهر في صفحة تواصل معنا وبيانات الشركة.",
      type: "localizedString",
      group: "contact",
    }),
    defineField({
      name: "mapUrl",
      title: "Google Maps Embed Code",
      description:
        "من Google Maps اختر Embed a map ثم اضغط COPY HTML والصق الكود كاملًا هنا.",
      type: "text",
      rows: 4,
      group: "contact",
    }),
    defineField({
      name: "footerDescription",
      title: "Footer description / وصف الفوتر",
      description: "النص التعريفي الذي يظهر بجانب الشعار في أسفل كل صفحة.",
      type: "localizedText",
      group: "company",
    }),
    defineField({
      name: "seo",
      title: "SEO & sharing / الظهور والمشاركة",
      type: "object",
      group: "seo",
      fields: [
        defineField({
          name: "title",
          title: "SEO title / عنوان محركات البحث",
          description:
            "العنوان الذي يظهر في Google وتبويب المتصفح ومشاركة الرابط.",
          type: "localizedString",
        }),
        defineField({
          name: "description",
          title: "SEO description / وصف محركات البحث",
          description:
            "الوصف الذي يظهر أسفل العنوان في نتائج Google ومشاركة الرابط.",
          type: "localizedText",
        }),
        defineField({
          name: "ogImage",
          title: "Open Graph image / صورة المشاركة",
          description:
            "الصورة الأساسية عند مشاركة صفحات الموقع. يفضل صورة أفقية 1200×630.",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social links / روابط التواصل",
      description:
        "تظهر روابط الحسابات في قسم Connect داخل الفوتر، وتستخدم أيضًا في بيانات SEO.",
      type: "array",
      group: "social",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
            }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        },
      ],
    }),
  ],
  preview: { select: { title: "companyName.ar", media: "logo" } },
});
