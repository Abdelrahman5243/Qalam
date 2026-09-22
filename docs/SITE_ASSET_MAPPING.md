# Site asset mapping

هذه هي النسخة المحلية الاحتياطية من الأصول. النسخة الأساسية في الإنتاج يتم رفعها من Sanity داخل `Site settings → Branding`. لوحة التحكم تحتاج 4 صور فقط.

| Sanity field           | Upload                      | Used in                           |
| ---------------------- | --------------------------- | --------------------------------- |
| Header logo            | `logo-horizontal-light.svg` | Desktop header                    |
| Mobile logo            | `icon-light.svg`            | Compact mobile header             |
| Footer logo            | `logo-stacked-light.svg`    | Dark footer                       |
| SEO → Open Graph image | `og-image-1200x630.png`     | WhatsApp, Facebook and X previews |

## Local fallback folders

- `public/logo/`: desktop header and footer logos.
- `public/icon/`: standalone building marks for mobile and decorative UI.
- `public/favicons/`: browser, Apple and PWA icons.
- `public/og/`: the 1200×630 social preview image.

Do not upload anything from `_archive_not_used/`; those are old duplicates.
