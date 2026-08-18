# Wuhu Vue Admin Agent Guidelines

本文件用于约束在本仓库内工作的 AI 代理、协作者和自动化脚本。所有改动都应优先贴合当前项目结构与既有风格，避免引入不必要的新范式。

## 项目概况

- 技术栈：Vue 3.6、TypeScript、Vite 8、Pinia、Vue Router、Antdv Next、UnoCSS、Less。
- 包管理器：pnpm。优先使用 `pnpm` 执行脚本，不混用 npm/yarn。
- 主要源码目录：
  - `src/views`：业务页面和模板页面，路由组件放在这里。
  - `src/components`：跨业务通用组件。
  - `src/composables`：跨模块复用的组合式逻辑。
  - `src/utils`：跨模块复用的工具函数。
  - `src/directives`：跨模块复用的Vue指令。
  - `src/pages`：页面组件,例如登录页面等等。
  - `src/store`：Pinia 状态。
  - `src/router`：Vue Router 配置文件。
  - `src/config`：全局配置文件,例如菜单配置(menu.ts)等等。
  - `src/locales`：多语言配置文件,例如英文配置(en.ts)等等。
  - `src/apis`：API 调用函数,例如登录接口、获取用户信息接口等等。
  - `src/style`、`unocss`：全局样式、主题变量、UnoCSS 配置。
  - `build`：Vite 构建、插件、路由组件校验等工程配置。

## 基本工作原则

- 先读现有代码，再动手实现。新增能力应遵循相邻模块的组织方式、命名方式和交互习惯。
- 保持改动范围克制，不做无关重构，不整理和任务无关的历史代码。
- 工作区可能存在用户已有改动。不要回滚、覆盖或格式化无关文件。
- 优先补齐真实可用的业务闭环：状态、空态、错误态、加载态、权限/禁用态、响应式布局和校验反馈。
- 新增大功能时使用 feature folder，避免把复杂逻辑堆进单个 `index.vue`。

## Vue 与 TypeScript 规范

- 默认使用 Vue 3 Composition API 与 `<script setup lang="ts">`。
- SFC 顺序建议保持为：`<script setup lang="ts">`、`<template>`、`<style scoped>`。
- 组件命名使用 PascalCase，文件名也使用 PascalCase，例如 `TaskSummaryCard.vue`。模板中使用组件时也遵循PascalCase命名规范,例如`<TaskSummaryCard />`。
- 类型优先显式声明，组件 props/emits 使用 type-based `defineProps` / `defineEmits`。
- 原始值状态优先使用 `shallowRef`，复杂对象频繁整体替换时也优先 `shallowRef`；需要深层可变表单时再使用 `reactive`。
- 派生数据使用 `computed`，不要在模板里写复杂 filter/sort/map。
- 副作用使用 `watch`，异步 watch 需要清理过期请求或定时器。
- 不使用 `v-html` 渲染用户输入；确需 HTML 时必须先明确可信来源或做清洗。
- `v-for` 必须有稳定 key，避免 `v-if` 和 `v-for` 放在同一个元素上。

## 组件拆分原则

- 路由级页面只做组合和数据编排，不承载大量 UI 细节。
- 当一个组件同时负责以下两类以上职责时，应拆分：
  - 数据/状态编排
  - 表单或筛选输入
  - 列表/表格/画布渲染
  - 属性面板/详情面板
  - 弹窗/抽屉
  - 导入导出/源码面板
- 一个中大型功能推荐结构：
  - `index.vue`：页面装配。
  - `types.ts`：领域类型。
  - `data.ts`：静态配置、默认数据、模板。
  - `composables/useXxx.ts`：状态、动作、校验、导入导出。
  - `components/`：按 UI 区块拆分子组件。
- 子组件遵循 props down、events up。不要在子组件里直接修改父级对象。
- 可复用但不跨业务的组件先放在当前 feature 的 `components` 下，确认多处复用后再提升到 `src/components`。
- 复杂业务逻辑优先放到 composable 或纯工具函数中，不要塞进模板表达式。

## 样式与 UnoCSS 规范

- `src/views/**/*.vue`（包括页面下的业务子组件）优先使用 UnoCSS 原子类完成布局、间距、颜色、边框、字体、状态和常规过渡；这些场景不要新建页面级 `.css` / `.less` 文件。
- 优先使用 UnoCSS class 编写样式，特别是布局、间距、颜色、边框、字体、hover/disabled 状态。
- 项目已配置 `uno.config.ts`，内容扫描范围为 `src/**/*.{vue,ts,tsx}`，新增样式 class 应写在该范围内。
- 主题色优先使用现有 token 和语义色：
  - text有primary、success、warning、error、info五种状态颜色,main、regular、secondary、muted、placeholder、disabled、link是字体颜色,例如:`text-primary`、`text-success`、`text-main`等。
  - 背景色有 hover、 active、 selected、 disabled、 fill 、 mask 等状态颜色,每种状态有个8级别颜色,例如bg-hover-1、bg-active-3等, bg-hover 默认颜色为 `bg-hover-4`, bg-active 默认颜色为 `bg-active-4`, bg-selected 默认颜色为 `bg-selected-4`, bg-disabled 默认颜色为 `bg-disabled-4`。
  - border颜色也支持8个级别和五种状态颜色,例如`border-color-1`、`border-color-2`,`border-primary`等。
- text字体尺寸有xs、sm、md、2md、lg、xl、2xl、3xl、4xl、5xl级别,对应`text-xs`、`text-sm`、`text-md`、`text-lg`、`text-xl`、`text-2xl`、`text-3xl`、`text-4xl`、`text-5xl`等。
- shadow的样式匹配`/^shadow-(t|r|b|l|all)(?:-(sm|md|lg|xl|2xl))?$/`,例如`shadow-t-sm`、`shadow-r-md`、`shadow-b-lg`、`shadow-l-xl`、`shadow-all`等。
  - `shadow-t-sm`：顶部小阴影
  - `shadow-r-md`：右侧中阴影
  - `shadow-b-lg`：底部大阴影
  - `shadow-l-xl`：左侧超大阴影
  - `shadow-all`：所有方向大阴影
- 图标优先使用 `Icon` 全局组件和 lucide 图标，例如 `i-lucide:settings`。
- 只有在以下情况使用 scoped CSS / Less：
  - CSS Grid 复杂模板或响应式布局很难用 class 表达。
  - 第三方组件深度样式覆盖。
  - 画布连接线、编辑器 surface、动画关键帧等结构性样式。
- scoped CSS 中优先使用 class selector，少用元素选择器，谨慎使用 `:deep()`。
- 不要引入新的全局样式，除非是项目级 token、reset 或跨应用基础能力。
- 新 UI 应兼顾深色/浅色主题，避免硬编码大量不可适配的颜色。

## Antdv Next 与交互规范

- 表单、弹窗、抽屉、选择器、表格等通用管理后台控件优先使用 Antdv Next。
- 按钮内有明确语义图标时使用图标 + 文案；纯工具按钮优先使用图标并提供清晰状态。
- 常见交互必须覆盖：
  - loading
  - empty
  - disabled
  - error
  - success feedback
  - destructive action confirmation
- 管理后台页面应偏高信息密度、清晰分区、可扫描，不做营销页式大 hero。

## 路由与菜单

- 静态菜单在 `src/config/menu.ts` 中维护。
- 路由组件通过菜单 path 映射到 `src/views` 下的页面文件。
- 新增菜单 path 时必须确保存在对应路由组件，例如：
  - `/template/foo` -> `src/views/template/foo/index.vue`
  - `/sys/user` -> `src/views/sys/user/index.vue`
- 不要把路由页面放到 `components` 子目录下，构建插件会忽略 `views/**/components/**`。
- 新增菜单项需要设置稳定的 `id`、`title`、`type`、`rootId`、`parentId`、`level`、`icon`、`path`。

## 状态、请求与数据

- 跨页面共享状态放 Pinia；单页面/单功能状态优先放 feature composable。
- 请求逻辑优先复用 `src/utils/http` 和 `src/apis` 中的封装。
- 表格、报表、设计器、工作流等复杂页面应提供本地 sample data，确保无后端时也可预览核心交互。
- 导入导出 JSON/Schema 时必须做基本校验，错误信息面向用户可理解。
- 不要在组件模板里直接拼复杂业务数据，先在 `computed` 或工具函数中处理。

## 性能规范

- 大型对象、画布节点、图表实例、编辑器实例等使用 `shallowRef`，避免深层响应式代理。
- 图表、编辑器、虚拟画布等重组件应延迟渲染或按需加载，销毁时释放实例。
- 高频交互避免触发全局 store 或大范围响应式更新。
- 列表很长时考虑虚拟滚动、分页或局部渲染。
- 避免在模板中调用会创建新数组/对象的函数。
- 定时器、事件监听、第三方实例必须在卸载时清理。
- 动画优先使用 transform/opacity，避免频繁触发布局计算。

## 代码质量与验证

常用命令：

```bash
pnpm dev
pnpm typecheck
pnpm lint
pnpm lint:style
pnpm fmt:check
pnpm build
```

- 提交前至少针对改动范围运行 lint/format/typecheck 中可行的检查。
- 如果全量检查因仓库既有问题失败，需要明确记录失败文件和错误，不要顺手修改无关问题。
- 新增页面或复杂交互后，应在浏览器中验证实际渲染、响应式布局和控制台错误。
- 涉及菜单路由时，确认页面能通过对应 URL 直接访问。

## 文件编辑约束

- 手写改动优先使用补丁方式，保持 diff 可读。
- 不要批量格式化整个仓库，除非任务明确要求。
- 不要修改生成物，除非它们是项目约定需要提交的文件。
- 不要提交 `dist`、临时日志、缓存文件。
- 发现命名大小写迁移时，确保 import 与实际文件名一致，避免 Windows 下正常但 CI/Linux 失败。

## Git Commit Rules

Commit Message:

```bash
<type>(<scope>): <subject>
```

Types:

- feat
- fix
- refactor
- perf
- docs
- style
- chore
- test

Examples:

- feat(table): support virtual scrolling
- fix(form): handle empty value
- refactor(router): simplify route guard

## 常见功能实现建议

- 新增业务页面：先建 `views/<module>/<feature>/index.vue`，复杂功能再拆 `components`、`composables`、`types.ts`、`data.ts`。
- 新增设计器类页面：需要包含画布、组件库、属性面板、源码/Schema、预览/测试、导入导出和校验结果。
- 新增图表：优先复用 VChart 和项目现有 `useVChartTheme` / deferred chart 模式。
- 新增编辑器：优先复用已有 Editor、CodeMirror、JsonView 等组件或模式。
- 新增图标：优先使用 lucide icon class，不手写 SVG。

## 禁止事项

- 不要为了单个页面引入新的 UI 框架或状态管理库。
- 不要把复杂业务状态散落在多个子组件中互相隐式修改。
- 不要在全局样式里写一次性页面样式。
- 不要直接改用户未请求的历史代码、配置或大面积菜单。
- 不要用硬编码假接口替代已有 API 约定；mock/sample data 应清晰标注并易于替换。

## Caveman Mode

Response style:

- concise
- technical
- direct

Avoid:

- greetings
- apologies
- motivational language
- unnecessary explanations

Prefer:

- Issue
- Cause
- Fix

over long paragraphs.

## LazyCodex Rules

Before coding:

- Read relevant files first.
- Search for existing implementation.
- Reuse existing utilities.
- Reuse existing components.

When changing code:

- Make smallest possible diff.
- Do not introduce new dependencies unless necessary.
- Do not change unrelated code.

After coding:

- Check for type errors.
- Check for lint errors.
- Verify imports.

## Page Style Rules

- The global style directory is `src/styles`.
- Page-level styles must prefer UnoCSS atomic classes, existing shortcuts, and style tokens for layout, spacing, colors, borders, typography, and states.
- Reuse transition classes from `src/styles/transition` instead of duplicating page-level transition or keyframe definitions.
- These rules apply to route pages; do not batch-edit `src/views/**/components/**` unless the task explicitly requests component changes.
