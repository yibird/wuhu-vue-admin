<div align="center">
  <img src="./src/assets/svg/logo.svg" width="72" alt="Wuhu Vue Admin 标志" />
  <h1>Wuhu Vue Admin</h1>
  <p>功能丰富的 Vue 管理后台应用与实现参考。</p>

  <p>
    <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-3.6_RC-42b883?logo=vuedotjs&amp;logoColor=white" alt="Vue 3.6 RC" /></a>
    <a href="https://vite.dev/"><img src="https://img.shields.io/badge/Vite-8.2-646cff?logo=vite&amp;logoColor=white" alt="Vite 8.2" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&amp;logoColor=white" alt="TypeScript strict" /></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-22c55e" alt="MIT License" /></a>
  </p>

  <p><strong>中文</strong> · <a href="./README.md">English</a></p>
</div>

Wuhu Vue Admin 将可配置的管理后台外壳与仪表盘、系统模块、工作流工具、沟通视图、AI 工作区示例和可复用复杂组件结合在一起。项目用于构建和评估现代管理产品，不是一个开箱即用的完整后端服务。

开发模式包含认证、用户和角色的本地 mock 接口。许多模板页面也提供了示例数据，因此无需后端即可体验主要交互。

## 功能概览

| 领域      | 已包含能力                                                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------------- |
| 应用外壳  | 多级导航、标签页与 keep-alive、全局搜索、主题切换、国际化、锁屏、任务/下载/通知中心，以及可配置的 Header 部件 |
| 仪表盘    | 分析看板、工作台、系统监控、任务看板、文件管理器和工单流程                                                    |
| 业务模块  | 客户管理、文章、用户、角色、部门、菜单、字典、文件、通知和审计日志                                            |
| 设计器    | 低代码、报表、图表、审批流和工作流设计器，并提供本地预览数据                                                  |
| 通信与 AI | IM 风格聊天、全局消息搜索、Agent 管理、AI 对话和知识库页面                                                    |
| 组件      | Tiptap 编辑器、CodeMirror、图片裁剪、Gantt、JSON 查看器、文件预览、图标工具、虚拟化内容和拖拽示例             |
| 工程能力  | 路由契约校验、Mock API、严格 TypeScript、UnoCSS 语义化 token、构建分析和 gzip 体积预算                        |

## 预览

![](./images/01.png)
![](./images/02.png)
![](./images/03.png)
![](./images/04.png)
![](./images/05.png)
![](./images/06.png)
![](./images/07.png)
![](./images/08.png)
![](./images/09.png)
![](./images/10.png)
![](./images/11.png)
![](./images/12.png)
![](./images/13.png)
![](./images/14.png)

## 技术栈

| 分类      | 技术                                                      |
| --------- | --------------------------------------------------------- |
| 核心      | Vue 3、TypeScript、Pinia、Vue Router、Vue I18n、VueUse    |
| UI 与样式 | Antdv Next、UnoCSS、Less、Lucide icons、OverlayScrollbars |
| 可视化    | ECharts、Vue Flow、Frappe Gantt                           |
| 编辑能力  | Tiptap、CodeMirror、Cropper.js、DOMPurify                 |
| 交互      | Motion Vue、dnd-kit、Swapy、Viselect、TanStack Virtual    |
| 工具链    | Vite 8、pnpm 10、Oxlint、Oxfmt、Stylelint                 |

## 环境要求

- Node.js 24.x
- pnpm 10.x

## 快速开始

```bash
git clone https://github.com/yibird/wuhu-vue-admin.git
cd wuhu-vue-admin
pnpm install
pnpm dev
```

打开 [http://localhost:5555](http://localhost:5555)。开发环境的 mock 接口接受任意非空账号和密码；本地可以使用 `admin` / `admin`。

## 环境变量

Vite 从 `env` 目录加载共享环境文件和模式专属环境文件。开发环境使用 `env/.env` 和 `env/.env.development`；生产环境使用 `env/.env` 和 `env/.env.production`。

| 变量                            | 默认值                  | 用途                          |
| ------------------------------- | ----------------------- | ----------------------------- |
| `VITE_APP_NAME`                 | `Wuhu-admin`            | 应用中显示的品牌名称          |
| `VITE_APP_TITLE`                | `Wuhu-admin`            | 浏览器标题和应用标题          |
| `VITE_PORT`                     | `5555`                  | 开发服务器端口                |
| `VITE_API_BASE_URL`             | `/api`                  | HTTP 客户端基础路径           |
| `VITE_API_PROXY_URL`            | `http://localhost:8080` | 开发环境代理目标              |
| `VITE_CDN`                      | `false`                 | 是否启用生产环境 CDN 导入插件 |
| `VITE_IMAGE_OPTIMIZER`          | `false`                 | 是否启用生产环境图片优化      |
| `VITE_PERFORMANCE_GUARD_STRICT` | 构建时为 `true`         | 性能守卫违规时是否让构建失败  |

## 主要脚本

| 命令                 | 说明                                       |
| -------------------- | ------------------------------------------ |
| `pnpm dev`           | 使用本地 Mock API 启动开发服务器           |
| `pnpm build`         | 校验路由、执行类型检查并创建生产构建       |
| `pnpm build:test`    | 使用 `test` 环境模式构建                   |
| `pnpm preview`       | 在本地预览生产构建                         |
| `pnpm routes:check`  | 验证激活菜单路径能够解析到路由组件         |
| `pnpm typecheck`     | 执行 Vue 和 TypeScript 项目检查            |
| `pnpm lint`          | 执行 Oxlint                                |
| `pnpm lint:style`    | 检查 Vue、Less 和 CSS 样式                 |
| `pnpm fmt:check`     | 使用 Oxfmt 检查代码格式                    |
| `pnpm analyze`       | 构建并生成 bundle 分析结果                 |
| `pnpm bundle:check`  | 检查已有 `dist` 目录是否符合 gzip 体积预算 |
| `pnpm build:analyze` | 执行 bundle 分析并校验体积预算             |

## 提交、评审与发布流程

当前仓库使用 Husky 执行本地 Git 检查，使用 `standard-version` 手动生成版本和发布记录。仓库目前还没有配置 GitHub Actions、自动发布 PR 或生产环境部署流程。

### 1. 安装项目

克隆项目后先执行一次：

```bash
pnpm install
```

`prepare` 脚本会初始化 Husky。初始化完成后，在当前工作副本中创建提交时会自动执行仓库配置的 Git hooks。

### 2. 创建分支并修改代码

功能或修复建议使用短生命周期分支，不要直接提交到 `main`：

```bash
git switch -c feat/ticket-center
```

每个提交尽量只包含一个清晰的变更。提交类型应该描述用户可见的变化或工程变化：

| 类型       | 含义                     |
| ---------- | ------------------------ |
| `feat`     | 新增功能                 |
| `fix`      | 修复缺陷                 |
| `refactor` | 重构代码结构，不改变行为 |
| `perf`     | 性能优化                 |
| `docs`     | 文档变更                 |
| `test`     | 添加或修改测试           |
| `build`    | 构建工具或依赖变更       |
| `ci`       | CI 配置变更              |
| `chore`    | 其他维护性变更           |

### 3. 创建提交

推荐使用交互式提交命令：

```bash
pnpm commit
```

该命令会打开项目配置的 `cz-git` 提示。也可以直接使用符合规范的提交信息：

```bash
git add src/views/dashboard/ticket
git commit -m "feat(ticket): add ticket center"
```

提交信息格式为：

```text
<type>(<scope>): <subject>
```

其中 `scope` 可选。不兼容变更应使用 `!`，或者在提交正文或尾部包含 `BREAKING CHANGE:`。

### 4. 创建提交时会发生什么

Husky 会执行两个 hooks：

1. `pre-commit` 执行 `lint-staged`。它只检查暂存区文件，并根据文件类型使用 Oxlint、Oxfmt、Stylelint 或对应格式化工具进行检查和修复。
2. `commit-msg` 执行 Commitlint。如果提交信息不符合允许的 Conventional Commits 类型，提交会被拒绝。

如果 hook 失败，先根据错误信息修复，再重新执行提交。正常流程不应使用 `--no-verify` 绕过检查。

### 5. 创建 PR 前执行检查

根据变更范围执行对应检查。对于较大变更，建议完整执行：

```bash
pnpm routes:check
pnpm typecheck
pnpm lint
pnpm lint:style
pnpm fmt:check
pnpm test:unit
pnpm build
```

聚合命令 `pnpm check` 会执行路由检查、单元测试、类型检查、Oxlint 和 Playwright E2E 测试。但它不包含样式检查和生产构建，因此涉及样式或构建配置时仍需单独执行对应命令。

### 6. 推送与代码评审

推送分支并创建 Pull Request：

```bash
git push -u origin feat/ticket-center
```

在 PR 中检查代码差异、页面截图、路由变更、环境变量变更和迁移说明。当前仓库没有提交 GitHub Actions workflow，因此 GitHub 不会自动运行 CI 检查。发起评审前，应由作者在本地完成必要检查。

评审通过后，将 Pull Request 合并到发布分支，通常是 `main`。

### 7. 创建发布版本（当前流程）

当前发布命令为：

```bash
pnpm release
```

如果仓库还没有发布 tag，并且需要将 `package.json` 中的当前版本作为首个发布版本，请执行：

```bash
pnpm release -- --first-release
```

该命令会创建首个 changelog、发布提交和 tag，但不会递增当前版本号。如果需要指定首个版本号，可以执行类似 `pnpm release -- --release-as 0.1.0` 的命令。首个 tag 创建完成后，后续版本使用常规的 `pnpm release` 命令。

该命令会执行 `standard-version`，通常完成以下操作：

1. 读取上一个 tag 之后的 Conventional Commits。
2. 计算下一个版本号。
3. 创建或更新 `CHANGELOG.md`。
4. 更新 `package.json` 中的版本号。
5. 创建类似 `chore(release): vX.Y.Z` 的发布提交。
6. 创建类似 `vX.Y.Z` 的 Git tag。

发布前请确认工作区干净，并且发布分支包含了要发布的变更：

```bash
git switch main
git pull --ff-only origin main
git status --short
pnpm install --frozen-lockfile
pnpm check
pnpm build
# 根据上文选择首次发布或常规发布命令。
```

执行完成后，检查生成的 changelog、版本号、发布提交和 tag。确认无误后，同时推送提交和 tag：

```bash
git push origin main
git push origin vX.Y.Z
```

如果发布提交已经在 `main` 上，也可以将 tag 一起推送：

```bash
git push --follow-tags origin main
```

`pnpm changelog` 只生成或更新 changelog 内容，不会创建版本提交和 tag。需要预览或只更新 changelog 时可以使用它。

### 发布说明与当前限制

- 推送 Git tag 到 GitHub 不等于创建 GitHub Release。如果项目需要 Release 页面，需要根据 tag 手动创建。
- 仓库没有定义生产部署流程。生产构建产物是 `dist/`，实际部署由托管或部署平台负责。
- `release-please` 已被评估为后续发布工具，但目前尚未接入项目。添加 GitHub Actions workflow 之前，推送到 `main` 不会自动创建发布 PR 或完成发布。

计划中的流程如下：

```mermaid
flowchart LR
  A[创建分支] --> B[修改代码]
  B --> C[创建提交]
  C --> D[Husky 检查]
  D --> E[推送分支]
  E --> F[Pull Request 评审]
  F --> G[合并 main]
  G --> H[release-please 创建发布 PR]
  H --> I[合并发布 PR]
  I --> J[创建 tag 和 GitHub Release]
  J --> K[部署 dist/]
```

## 项目结构

```text
src/
|-- apis/          后端 API 适配器和请求类型
|-- components/    跨功能复用组件
|-- composables/   跨功能组合式逻辑
|-- config/        菜单和应用配置
|-- constants/     共享常量
|-- directives/    全局 Vue 指令
|-- layouts/       应用外壳和布局功能
|-- locales/       多语言文案和国际化配置
|-- pages/         登录、注册和其他独立页面
|-- plugins/       应用级插件配置
|-- router/        路由注册和路由守卫
|-- store/         Pinia 状态仓库
|-- styles/        全局 token、主题和过渡样式
|-- utils/         通用工具和 HTTP 客户端
  -- views/         路由级业务页面和模板页面
build/             Vite 配置和构建插件
env/               共享环境文件和模式专属环境文件
mock/              开发环境 Mock 接口和示例数据
scripts/           路由和 bundle 校验脚本
types/             全局 TypeScript 声明
unocss/            UnoCSS 规则、预设、转换器和 shortcuts
```

## 添加路由页面

1. 在 `src/views/<module>/<feature>/index.vue` 创建路由组件。
2. 在 `src/config/menu.ts` 中添加菜单定义，并设置稳定的 `id`、`path`、层级关系和图标。
3. 将功能专属组件和 composable 放在当前 feature 目录中，确认跨功能复用后再提升目录层级。
4. 运行 `pnpm routes:check`，验证菜单到页面的映射契约。

例如，`/template/example` 对应 `src/views/template/example/index.vue`。路由页面不能放在 feature 的 `components` 目录下，因为路由组件扫描器会主动忽略嵌套的组件目录。

## Bundle 体积预算

在检查体积预算前先执行生产构建：

```bash
pnpm build
pnpm bundle:check
```

默认 gzip 限制为：递归初始 JavaScript 700 KiB、初始 CSS 100 KiB、单个 JavaScript chunk 3 MiB、全部 JavaScript 5 MiB。CI 中可以通过 `BUNDLE_INITIAL_JS_GZIP_MAX`、`BUNDLE_INITIAL_CSS_GZIP_MAX`、`BUNDLE_SINGLE_JS_GZIP_MAX` 和 `BUNDLE_TOTAL_JS_GZIP_MAX` 覆盖这些限制。

## 项目状态

项目当前处于 1.0 之前，仍在持续开发中。Mock API 和示例数据仅用于本地预览；正式部署前，请替换为生产服务，并重新审查认证、权限、持久化和错误处理逻辑。

## 许可证

[MIT](./LICENSE) © 2026 zchengfeng。
