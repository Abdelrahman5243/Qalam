# New Section Workflow

هذا الملف يوثق الطريقة المعتمدة لإضافة أي Section جديد للموقع.

المشروع يستخدم:
- Next.js App Router
- TypeScript
- Sanity CMS
- Arabic وEnglish
- RTL للعربية
- Framer Motion للحركة
- Mobile-first CSS

## 1. تحديد مكان الـ Section

قبل كتابة الكود حدد الصفحة المناسبة:

- Homepage: الخدمات، المميزات، Why choose us، المشاريع، وContact CTA.
- About: نبذة الشركة، الرؤية، الرسالة، القيم، والخبرة.
- Services أو Projects: التفاصيل الخاصة بنوع المحتوى.

المحتوى الخاص بهوية الشركة يوضع في About، والمحتوى التحويلي أو التجاري يوضع في Homepage.

## 2. إنشاء Sanity Schema

أنشئ schema مستقلًا داخل `sanity/schemas/`.

مثال:

~~~ts
import { defineField, defineType } from "sanity";

export const vision = defineType({
  name: "vision",
  title: "Our vision",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localizedText",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "title.ar" } },
});
~~~

ثم أضفه إلى `sanity/schemas/index.ts`.

استخدم:
- `localizedString` للنصوص القصيرة.
- `localizedText` للفقرات.
- يجب إدخال Arabic وEnglish.
- لا تضف نصوص dummy أو `initialValue` للـ Sections الجديدة.

## 3. إنشاء Type وService

ضع الملفات داخل Feature مناسب:

~~~text
features/about/
  components/vision-section.tsx
  services/vision-service.ts
  types.ts
~~~

الـ service يجب أن:

1. يقرأ الـ document من Sanity.
2. يستخدم locale الحالي أولًا.
3. يتحقق من الحقول المطلوبة.
4. يرجع `null` إذا كانت البيانات ناقصة.
5. لا يخترع أي محتوى داخل الكود.

مثال Query:

~~~ts
const visionQuery = `*[_id == "vision"][0]{
  "eyebrow": coalesce(eyebrow[$locale], eyebrow.ar),
  "title": coalesce(title[$locale], title.ar),
  "description": coalesce(description[$locale], description.ar)
}`;
~~~

مثال Type:

~~~ts
export type Vision = {
  eyebrow: string;
  title: string;
  description: string;
};
~~~

## 4. بناء Component Mobile-first

الـ component يجب أن:

- يستقبل البيانات من props.
- يستقبل `locale`.
- يستخدم `dir="rtl"` للعربية.
- يرجع `null` إذا كانت البيانات ناقصة.
- يستخدم HTML semantic مثل `section` و`h2`.
- يضع المحتوى في Sanity، وليس داخل الـ component.
- يعيد استخدام tokens الموجودة مثل:
  - `--surface-page`
  - `--brand-green`
  - `--brand-ink`
  - `--container-gutter`
  - `--section-y`

ابدأ بتصميم الموبايل كـ default CSS، ثم أضف تعديلات الشاشات الأكبر باستخدام:

~~~css
@media (min-width: 700px) {
  /* tablet and desktop adjustments */
}
~~~

## 5. استخدام Framer Motion

استخدم animation هادئة واحدة للـ Section، مع دعم reduced motion:

~~~tsx
const reduceMotion = useReducedMotion();

<motion.div
  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
>
  ...
</motion.div>
~~~

لا تحرك كل عنصر بدون حاجة. يجب دائمًا دعم `useReducedMotion()`.

## 6. ربط البيانات بالصفحة

حمّل البيانات في route page:

~~~ts
const [about, vision] = await Promise.all([
  getAbout(locale, fallbackImage),
  getVision(locale),
]);
~~~

ثم مررها للـ component:

~~~tsx
<VisionSection vision={vision} locale={locale} />
~~~

الـ component هو المسؤول عن عدم الظهور عندما تكون البيانات ناقصة.

## 7. تنظيم Sanity Studio

ضع الـ Sections المرتبطة في مجموعة واضحة للعميل:

~~~ts
S.listItem()
  .id("aboutSections")
  .title("About sections")
  .child(
    S.list()
      .title("About sections")
      .items([
        S.documentTypeListItem("about").title("About us"),
        S.listItem()
          .id("vision")
          .title("Our vision")
          .child(
            S.document()
              .schemaType("vision")
              .documentId("vision"),
          ),
      ]),
  )
~~~

مهم: كل عنصر داخل `S.list().items()` يجب أن يكون `S.listItem()`.

استخدام `S.document()` مباشرة داخل القائمة يسبب الخطأ:

~~~text
List items must be of type "listItem", got "object"
~~~

لا تضع `Why choose us` داخل About sections إذا كان خاصًا بالـ Homepage.

## 8. إدخال البيانات باستخدام NDJSON

Sanity يحتاج JSON document واحد في كل سطر.

مثال ملف `vision.ndjson`:

~~~json
{"_id":"vision","_type":"vision","eyebrow":{"ar":"رؤيتنا","en":"Our vision"},"title":{"ar":"الارتقاء بالأمان والراحة والكفاءة","en":"Advancing Safety, Comfort, and Efficiency"},"description":{"ar":"تقديم حلول مصاعد متقدمة ومتكاملة تعزز الأمان والراحة والكفاءة في مختلف القطاعات، مع الحفاظ على أعلى معايير الجودة والابتكار.","en":"To provide advanced and integrated elevator solutions that enhance safety, comfort, and efficiency across different sectors while maintaining the highest standards of quality and innovation."}}
~~~

تحقق من JSON قبل الاستيراد:

~~~bash
node -e "JSON.parse(require('fs').readFileSync('vision.ndjson','utf8')); console.log('Valid JSON')"
~~~

استورد إلى production:

~~~bash
npx sanity datasets import vision.ndjson -d production
~~~

قواعد NDJSON:

- JSON object كامل واحد في كل سطر.
- لا تستخدم Markdown fences داخل الملف.
- لا تضف comments أو trailing commas.
- استخدم double quotes العادية.
- أغلق الـ outer object بقوس إضافي.
- يجب أن يطابق `_id` الـ ID المستخدم في service.

## 9. التحقق النهائي

شغّل:

~~~bash
npm run lint
npx tsc --noEmit
git diff --check
~~~

ولـ UI changes شغّل detector:

~~~bash
node /home/ragab/.agents/skills/impeccable/scripts/detect.mjs --json \
  app/'[locale]'/about/page.tsx \
  features/about/components/<section-name>.tsx \
  app/globals.css
~~~

تحقق يدويًا من:

- Arabic RTL وEnglish LTR.
- Mobile ثم tablet ثم desktop.
- عدم ظهور section عند نقص بيانات Sanity.
- ظهور الحقول في المكان الصحيح داخل Studio.
- إدخال اللغتين وعرضهما.
- reduced-motion.
- عدم وجود نصوص dummy.

## Architecture

~~~text
Sanity schema
    ↓
Studio content أو NDJSON import
    ↓
feature service + locale query
    ↓
TypeScript type
    ↓
page route
    ↓
section component
    ↓
mobile-first CSS + Framer Motion
~~~

