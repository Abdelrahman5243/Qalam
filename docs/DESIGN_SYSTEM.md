# Elevator Company Design System

This is the visual language extracted from the approved hero and contact CTA references.

## Direction

The interface is a calm, premium elevator brand: architectural imagery, strong white typography over darkened photography, a muted green brand action, and generous horizontal spacing. The visual language should feel confident and precise rather than decorative.

## Tokens

| Token                  | Value                  | Usage                                 |
| ---------------------- | ---------------------- | ------------------------------------- |
| `--surface-page`       | `#f7f8f3`              | Light page surfaces                   |
| `--surface-header`     | `#fafbf7`              | Header and navigation                 |
| `--surface-dark`       | `#1d4034`              | Contact CTA and dark brand sections   |
| `--brand-green`        | `#4f946c`              | Primary actions and active states     |
| `--brand-green-hover`  | `#62a37c`              | Hover state for actions               |
| `--brand-ink`          | `#1d241f`              | Light-surface text                    |
| `--text-on-dark`       | `#ffffff`              | Text on photography and dark surfaces |
| `--text-on-dark-muted` | `rgba(255,255,255,.8)` | Supporting text on dark surfaces      |
| `--motion-fast`        | `180ms`                | Hover and focus transitions           |

## Typography

- Use `Manrope` for English brand copy and `Cairo` for Arabic copy, with system fallbacks for resilience.
- Body copy uses a fluid `16px–18px` scale with approximately `1.7` line-height.
- Navigation uses a readable `15px` scale and a minimum `44px` interactive height.
- Hero headlines use a fluid `40px–76px` scale in English and a slightly smaller `38px–72px` scale in Arabic, with a taller Arabic line-height.
- Use large, bold headlines for the hero and CTA, but keep the maximum line length constrained.
- Use small uppercase tracked labels only for the hero eyebrow.
- Keep supporting copy readable with generous line-height; never use the display size for body or controls.

## Components

### Primary action

Solid brand-green background, white text, a minimum height of 52px, and a subtle upward hover movement.

### Secondary action

Transparent surface with a 1px white border on dark backgrounds. Use for exploration or lower-priority actions.

### Contact CTA

Dark green full-width band. Copy stays on the left in English mode, with WhatsApp as the outlined action and Contact Us as the filled action. On smaller screens, content and actions stack vertically.

## Responsive rules

- Shared container: `max-width: 1280px` with a fluid gutter from `16px` to `40px`.
- Desktop: a full-viewport hero with the header layered over the image and centered content.
- Short desktop screens: reduce vertical padding and headline size to keep the primary action visible.
- Tablet: navigation moves to its own row below the layered header.
- Mobile: navigation becomes horizontally scrollable and CTA actions become full-width stacked controls.
- Hero imagery always remains full-bleed and receives a directional dark overlay to protect text contrast.
