# Wuhu Vue Admin Design System

## 1. Atmosphere & Identity

Wuhu Vue Admin should feel like a quiet operations cockpit: dense enough for repeated admin work, but clean enough that users can scan decisions quickly. The signature is cool-neutral depth with restrained cyan-blue highlights, where important controls feel precise rather than promotional.

## 2. Color

### Palette

| Role              | Token                      | Light                | Dark                 | Usage                                   |
| ----------------- | -------------------------- | -------------------- | -------------------- | --------------------------------------- |
| Surface/page      | `--w-bg-page`              | Existing theme token | Existing theme token | Page background                         |
| Surface/container | `--w-bg-container`         | Existing theme token | Existing theme token | Panels, cards, shells                   |
| Surface/fill      | `--w-fill-color-tertiary`  | Existing theme token | Existing theme token | Soft strips and nested cells            |
| Text/main         | `--w-text-color`           | Existing theme token | Existing theme token | Headlines and primary copy              |
| Text/regular      | `--w-text-color-regular`   | Existing theme token | Existing theme token | Body copy                               |
| Text/secondary    | `--w-text-color-secondary` | Existing theme token | Existing theme token | Captions and helper text                |
| Border/default    | `--w-border-color-1`       | Existing theme token | Existing theme token | Subtle separators                       |
| Border/strong     | `--w-border-color-2`       | Existing theme token | Existing theme token | Active panels and tables                |
| Accent/primary    | `--w-color-primary`        | Existing theme token | Existing theme token | Primary actions, focus, selected states |
| Accent/success    | `--w-color-success`        | Existing theme token | Existing theme token | Positive states                         |
| Accent/warning    | `--w-color-warning`        | Existing theme token | Existing theme token | Billing and caution notes               |
| Accent/error      | `--w-color-error`          | Existing theme token | Existing theme token | Destructive actions                     |

### Rules

- Use project semantic CSS variables and UnoCSS semantic utilities before raw colors.
- Cyan-blue gradients are allowed only as thin highlights or ambient accents, never as the whole page identity.
- Pricing and dashboard pages use light/dark compatible surfaces; avoid one-off hardcoded palettes.

## 3. Typography

### Scale

| Level   | Size    | Weight  | Line Height | Tracking | Usage                                  |
| ------- | ------- | ------- | ----------- | -------- | -------------------------------------- |
| Display | 44-56px | 800-900 | 1.05        | 0        | Pricing hero and major page statements |
| H1      | 32-40px | 800     | 1.15        | 0        | Page titles                            |
| H2      | 22-28px | 700     | 1.25        | 0        | Section titles                         |
| H3      | 16-20px | 650     | 1.35        | 0        | Card titles                            |
| Body    | 14-16px | 400-500 | 1.6         | 0        | Default admin copy                     |
| Caption | 12-13px | 500-650 | 1.45        | 0        | Labels, metadata, badges               |

### Font Stack

- Primary: project default system UI stack.
- Mono: use only for numbers, quotas, and technical identifiers.

### Rules

- Letter spacing stays `0` in app UI.
- Use tabular numeric styling for prices, quotas, and comparison values when possible.

## 4. Spacing & Layout

### Base Unit

All spacing derives from 4px. Common project classes map to `4/8/12/16/20/24/32/40/48/64`.

### Grid

- Max content width: 1440px.
- Admin pages use responsive CSS grid with dense but breathable panels.
- Mobile layouts collapse to one column with no horizontal overflow.

### Rules

- Cards and panels use radius `4px` or `8px`.
- Prefer internal scroll containers through existing `Scrollbar` when content grows.

## 5. Components

### Pricing plan card

- **Structure**: plan identity, price block, quota metrics, CTA, feature list.
- **Variants**: default, active, recommended, enterprise/dark accent.
- **Spacing**: 16-24px internal rhythm, feature rows at 8-12px.
- **States**: hover translate, active border/fill, keyboard focus ring.
- **Accessibility**: selectable cards use `role="button"`, `aria-pressed`, Enter and Space.
- **Motion**: entry and hover use `transform` and `opacity` only.

### Pricing command summary

- **Structure**: selected plan, billing estimate, fit facts, recommendation note.
- **Variants**: sticky desktop panel, inline mobile panel.
- **Spacing**: 16px cells with subtle separators.
- **States**: primary CTA hover/focus handled by Antdv.
- **Accessibility**: visible heading and descriptive labels.
- **Motion**: ambient accent uses opacity/transform only.

## 6. Motion & Interaction

| Type     | Duration  | Easing                        | Usage                                |
| -------- | --------- | ----------------------------- | ------------------------------------ |
| Micro    | 120-160ms | ease-out                      | Button press, selected card feedback |
| Standard | 200-260ms | ease-in-out                   | Hover, panel emphasis                |
| Emphasis | 420-620ms | cubic-bezier(0.16, 1, 0.3, 1) | Page/card entrance                   |

### Rules

- Animate only `transform`, `opacity`, and `filter`.
- Respect `prefers-reduced-motion` for decorative movement.
- Every interactive custom element needs hover, active, and focus-visible states.

## 7. Depth & Surface

### Strategy

Mixed, but restrained: tonal-shift first, subtle border second, shadow only for active/elevated pricing surfaces.

| Level     | Value                          | Usage                          |
| --------- | ------------------------------ | ------------------------------ |
| Subtle    | theme border + fill shift      | Nested cells, compare table    |
| Default   | theme border + light shadow    | Pricing cards                  |
| Prominent | tinted shadow + ambient accent | Active plan and sticky summary |
