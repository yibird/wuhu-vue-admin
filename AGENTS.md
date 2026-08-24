# Wuhu Vue Admin Agent Guidelines

本文件用于约束在本仓库内工作的 AI Agent、协作者和自动化脚本。

核心目标：

1. 优先理解并延续现有代码，而不是创造新的架构。
2. 优先简单、直接、可维护的实现，而不是过度抽象。
3. 优先复用已有能力，而不是重复造轮子。
4. 优先保持模块边界和入口清晰，而不是让 import 到处扩散。
5. 优先最小化 diff，而不是顺手重构整个模块。
6. 命名必须简单、准确、符合语义，不追求“看起来高级”。
7. 性能优化必须有明确收益，禁止为了理论性能增加复杂度。
8. 优先使用项目依赖库提供的工具方法(例如es-toolkit提供的深拷贝、限流、防抖)。

# 1. 项目概况

技术栈：

- Vue 3.6
- TypeScript
- Vite 8
- Pinia
- Vue Router
- Antdv Next
- UnoCSS
- Less
- pnpm
- dayjs、es-toolkit

包管理器：

- 统一使用 `pnpm`
- 禁止混用 npm / yarn / bun 作为项目包管理器
- 不要修改 lockfile 生成策略

主要目录：

```text
src/
├── apis/          # API 请求
├── components/    # 通用组件
├── composables/   # 通用的组合式逻辑
├── config/        # 全局配置
├── directives/    # Vue 指令
├── layouts/       # 页面布局
├── locales/       # 国际化
├── pages/         # 特殊页面，例如登录页
├── router/        # Vue Router
├── store/         # Pinia
├── style/         # 全局样式、主题变量
├── styles/        # 全局样式模块
├── utils/         # 通用工具函数
└── views/         # 业务页面

build/
├── plugins/
├── resolve/
├── optimizeDeps/
├── server/
└── ...
```

## Vue 与 TypeScript 规范

- 默认使用 Vue 3 Composition API 与 `<script setup lang="ts">`。
- SFC 顺序建议保持为: `<template>`、`<script setup lang="ts">`、`<style scoped>`。
- 组件命名使用 PascalCase，文件名也使用 PascalCase，例如 `TaskSummaryCard.vue`。模板中使用组件时也遵循PascalCase命名规范,例如`<TaskSummaryCard />`。
- 类型优先显式声明，组件 props/emits 使用 type-based `defineProps` / `defineEmits`。
- 原始值状态优先使用 `shallowRef`，复杂对象频繁整体替换时也优先 `shallowRef`;需要深层可变表单时再使用 `reactive`。
- 派生数据使用 `computed`，不要在模板里写复杂 filter/sort/map。
- 副作用使用 `watch`，异步 watch 需要清理过期请求或定时器。
- 不使用 `v-html` 渲染用户输入；确需 HTML 时必须先明确可信来源或做清洗。
- `v-for` 必须有稳定 key，避免 `v-if` 和 `v-for` 放在同一个元素上。
- 当组件复杂时请合理拆分组件，当组件逻辑复杂时请合理拆分composable Api, composable Api一般放在组件所在目录的同层级的composables目录,在该命令使用index.ts入口文件导入以简化 import。
- 图标优先使用Icon 组件,使用 lucide icon class,不要手写 SVG。
- 由于安装了 `unplugin-auto-import`,编写组件时可以无需导入 vue api。

## 样式规范

- 优先使用Unocss 原子化class,优先使用 shortcut 保证class的简洁性。
- 项目中Unocss rules 包含text、color、 background、border、shadow 等规则,请优先使用它们。
- src/styles/token.less 包含了项目的设计token,请优先使用它们保证视觉一致。
- scoped CSS 中优先使用 class selector,少用元素选择器,谨慎使用 `:deep()`,避免使用!important。

## 项目功能规范

- 新增业务页面:先建 `views/<module>/<feature>/index.vue`，复杂功能再拆 `components`、`composables`、`types.ts`、`data.ts`、`util.ts`,`components`和`composables`要有index.ts入口文件以简化导入。例如 /sys/user -> views/user/index/index.vue, /sys/user/detail -> views/user/detail/index.vue。
- 优先复用src/components 中的组件,当组件满足不了需求时再创建组件。

## 性能规范

- 大型对象、画布节点、图表实例、编辑器实例等使用 `shallowRef`，避免深层响应式代理。
- 图表、编辑器、虚拟画布等重组件应延迟渲染或按需加载，销毁时释放实例。
- 高频交互避免触发全局 store 或大范围响应式更新。
- 列表很长时考虑虚拟滚动、分页或局部渲染,数据量小的场景请使用CSS的 content-visibility 优化。
- 避免在模板中调用会创建新数组/对象的函数。
- 定时器、事件监听、第三方实例必须在卸载时清理。
- 动画优先使用 transform/opacity，避免频繁触发布局计算。
- 高频事件（`scroll`、`resize`、`mousemove`、`pointermove` 等）应避免直接执行昂贵逻辑，必要时使用节流、`requestAnimationFrame` 或合适的 Observer。
- 避免不必要的深度 `watch`，优先监听具体字段或使用 `computed` 缩小依赖范围。
- 大型组件、非首屏功能和不常用功能优先使用异步组件或动态导入，避免增加首屏加载体积。
- 不要为了“优化”提前引入复杂缓存、对象池、虚拟化等机制；先保持实现简单，仅在存在明确性能问题时优化。
- 低频使用或体积较大的组件优先使用异步组件（`defineAsyncComponent`）或动态导入,避免增加首屏加载体积。

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

## 代码质量与验证

常用命令:

```bash
pnpm dev
pnpm typecheck
pnpm lint
pnpm lint:style
pnpm fmt:check
pnpm build
```
