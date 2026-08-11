<div align="center">
  <img src="./src/assets/svg/logo.svg" width="72" alt="Wuhu Vue Admin logo" />
  <h1>Wuhu Vue Admin</h1>
  <p>A feature-rich Vue administration application and implementation reference.</p>

  <p>
    <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-3.6_RC-42b883?logo=vuedotjs&amp;logoColor=white" alt="Vue 3.6 RC" /></a>
    <a href="https://vite.dev/"><img src="https://img.shields.io/badge/Vite-8.2-646cff?logo=vite&amp;logoColor=white" alt="Vite 8.2" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&amp;logoColor=white" alt="TypeScript strict" /></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-22c55e" alt="MIT License" /></a>
  </p>

  <p><a href="./README.zh-CN.md">中文</a> · <strong>English</strong></p>
</div>

Wuhu Vue Admin combines a configurable admin shell with dashboards, system modules, workflow tooling, communication views, AI workspace examples, and reusable complex components. It is intended for building and evaluating modern management products rather than serving as a finished backend service.

Development mode includes local mock endpoints for authentication, users, and roles. Many template pages also ship with sample data, so the main interactions can be explored without a backend.

## Highlights

| Area                 | Included capabilities                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Application shell    | Multi-level navigation, tabs and keep-alive, global search, theme switching, i18n, lock screen, task/download/notice centers, and configurable header widgets |
| Dashboards           | Analysis, workbench, system monitor, task board, file manager, and ticket workflows                                                                           |
| Business modules     | Customer management, articles, users, roles, departments, menus, dictionaries, files, notices, and audit logs                                                 |
| Designers            | Low-code, report, chart, approval-flow, and workflow designers with local preview data                                                                        |
| Communication and AI | IM-style chat, global message search, Agent management, AI chat, and knowledge-base views                                                                     |
| Components           | Tiptap editor, CodeMirror, cropper, Gantt, JSON viewer, file preview, icon tools, virtualized content, and drag-and-drop examples                             |
| Engineering          | Route contract validation, mock APIs, strict TypeScript, UnoCSS semantic tokens, bundle analysis, and gzip size budgets                                       |

## Preview

![Analysis dashboard](./images/01.png)

| System monitor                     | File manager                     |
| ---------------------------------- | -------------------------------- |
| ![System monitor](./images/02.png) | ![File manager](./images/03.png) |

## Tech Stack

| Category       | Technology                                                |
| -------------- | --------------------------------------------------------- |
| Core           | Vue 3, TypeScript, Pinia, Vue Router, Vue I18n, VueUse    |
| UI and styling | Antdv Next, UnoCSS, Less, Lucide icons, OverlayScrollbars |
| Visualization  | ECharts, Vue Flow, Frappe Gantt                           |
| Editing        | Tiptap, CodeMirror, Cropper.js, DOMPurify                 |
| Interaction    | Motion Vue, dnd-kit, Swapy, Viselect, TanStack Virtual    |
| Tooling        | Vite 8, pnpm 10, Oxlint, Oxfmt, Stylelint                 |

## Requirements

- Node.js 24.x
- pnpm 10.x

## Quick Start

```bash
git clone https://github.com/yibird/wuhu-vue-admin.git
cd wuhu-vue-admin
pnpm install
pnpm dev
```

Open [http://localhost:5555](http://localhost:5555). The development mock accepts any non-empty account and password; `admin` / `admin` can be used locally.

## Environment Variables

Vite loads shared and mode-specific files from the `env` directory. Development uses `env/.env` and `env/.env.development`; production uses `env/.env` and `env/.env.production`.

| Variable                        | Default                 | Purpose                                     |
| ------------------------------- | ----------------------- | ------------------------------------------- |
| `VITE_APP_NAME`                 | `Wuhu-admin`            | Brand name rendered by the application      |
| `VITE_APP_TITLE`                | `Wuhu-admin`            | Browser and application title               |
| `VITE_PORT`                     | `5555`                  | Development server port                     |
| `VITE_API_BASE_URL`             | `/api`                  | HTTP client base URL                        |
| `VITE_API_PROXY_URL`            | `http://localhost:8080` | Development proxy target                    |
| `VITE_CDN`                      | `false`                 | Enable the production CDN import plugin     |
| `VITE_IMAGE_OPTIMIZER`          | `false`                 | Enable production image optimization        |
| `VITE_PERFORMANCE_GUARD_STRICT` | `true` in builds        | Fail builds on performance guard violations |

## Main Scripts

| Command              | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| `pnpm dev`           | Start the development server with local mock APIs          |
| `pnpm build`         | Validate routes, type-check, and create a production build |
| `pnpm build:test`    | Build with the `test` environment mode                     |
| `pnpm preview`       | Preview the production build locally                       |
| `pnpm routes:check`  | Verify active menu paths resolve to route components       |
| `pnpm typecheck`     | Run Vue and TypeScript project checks                      |
| `pnpm lint`          | Run Oxlint                                                 |
| `pnpm lint:style`    | Lint Vue, Less, and CSS styles                             |
| `pnpm fmt:check`     | Check formatting with Oxfmt                                |
| `pnpm analyze`       | Build and generate bundle analysis output                  |
| `pnpm bundle:check`  | Check an existing `dist` directory against gzip budgets    |
| `pnpm build:analyze` | Run bundle analysis and then enforce bundle budgets        |

## Project Structure

```text
src/
|-- apis/          Backend API adapters and request types
|-- components/    Cross-feature reusable components
|-- composables/   Cross-feature composables
|-- config/        Menu and application configuration
|-- constants/     Shared constants
|-- directives/    Global Vue directives
|-- layouts/       Application shell and layout features
|-- locales/       Locale messages and i18n setup
|-- pages/         Login, registration, and standalone pages
|-- plugins/       Application-level plugin setup
|-- router/        Route registration and guards
|-- store/         Pinia stores
|-- styles/        Global tokens, themes, and transitions
|-- utils/         Shared utilities and HTTP client
`-- views/         Route-level business and template pages
build/             Vite configuration and build plugins
env/               Shared and mode-specific environment files
mock/              Development mock endpoints and sample data
scripts/           Route and bundle validation scripts
types/             Global TypeScript declarations
unocss/            UnoCSS rules, presets, transformers, and shortcuts
```

## Add a Route Page

1. Create the route component at `src/views/<module>/<feature>/index.vue`.
2. Add its menu definition to `src/config/menu.ts` with a stable `id`, `path`, hierarchy, and icon.
3. Keep feature-specific components and composables inside the feature folder; promote them only after cross-feature reuse is established.
4. Run `pnpm routes:check` to verify the menu-to-view contract.

For example, `/template/example` maps to `src/views/template/example/index.vue`. Route pages must not be placed under a feature's `components` directory because the route component scanner intentionally ignores nested component folders.

## Bundle Budgets

Run a production build before checking budgets:

```bash
pnpm build
pnpm bundle:check
```

The default gzip limits are 700 KiB for recursive initial JavaScript, 100 KiB for initial CSS, 3 MiB for a single JavaScript chunk, and 5 MiB for total JavaScript. Override them in CI with `BUNDLE_INITIAL_JS_GZIP_MAX`, `BUNDLE_INITIAL_CSS_GZIP_MAX`, `BUNDLE_SINGLE_JS_GZIP_MAX`, and `BUNDLE_TOTAL_JS_GZIP_MAX`.

## Commit Convention

Use Conventional Commits:

```text
<type>(<scope>): <subject>
```

Common types are `feat`, `fix`, `refactor`, `perf`, `docs`, `style`, `test`, and `chore`.

## Project Status

The project is currently pre-1.0 and under active development. Mock APIs and sample data are for local preview; replace them with production services and review authentication, permissions, persistence, and error handling before deployment.

## License

[MIT](./LICENSE) © 2026 zchengfeng.
