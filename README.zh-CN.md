# Wuhu Vue Admin

中文 | [English](README.md)

Wuhu Vue Admin 是一个基于 Vue 的管理后台应用和参考实现，包含仪表盘、系统管理、工作流、聊天、编辑器及设计器类示例。

## 技术栈

- Vue 3、TypeScript、Pinia、Vue Router
- Vite 8、pnpm
- Antdv Next
- UnoCSS、Less
- Playwright、Node.js test runner

## 环境要求

- Node.js 24，或其他支持 TypeScript type stripping 的兼容版本
- pnpm 10

## 快速开始

```bash
pnpm install
pnpm dev
```

开发环境读取 `env/.env.development`。默认端口为 `5555`，`/api` 请求代理到 `http://localhost:8080`。

## 项目结构

```text
src/apis          后端 API adapter 和请求类型
src/components    跨功能通用组件
src/composables   跨功能组合式逻辑
src/config        静态菜单和应用配置
src/constants     共享常量
src/layouts       应用外壳和布局功能
src/locales       多语言资源
src/pages         登录、注册等独立页面
src/router        路由、守卫和动态注册
src/store         Pinia Store
src/style         全局 token 和结构样式
src/views         路由级业务和模板页面
types             全局 TypeScript 声明
unocss            UnoCSS 规则、预设和 shortcuts
build             Vite 构建配置
scripts           仓库校验脚本
tests             单元测试和契约测试
e2e               Playwright 测试
```

## 质量检查

```bash
pnpm routes:check
pnpm test:unit
pnpm typecheck
pnpm lint
pnpm lint:style
pnpm fmt:check
pnpm e2e
pnpm build
```

`pnpm routes:check` 会校验激活菜单 path 和页面组件是否匹配。`pnpm bundle:check` 检查已有的 `dist` 产物；CI 可设置 `BUNDLE_MAX_JS_KB` 来执行项目自己的 JavaScript 体积预算。

## 二次开发约定

- 路由页面放在 `src/views/<module>/<feature>/index.vue`。
- 菜单在 `src/config/menu.ts` 中维护；每个激活的路由菜单必须映射到真实页面。
- 认证逻辑集中在 `src/store/auth` 和 `src/apis/auth`，登录页面只负责收集凭据和展示状态。
- 报表、工作流和设计器 Schema 属于版本化数据，应用或持久化前必须经过解析、迁移、校验和脱敏。
- 从 components、composables、apis、utils 根 `index.ts` 导出的内容才是预期引用面；未文档化的深层 import 视为内部实现。

提交代码前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。安全漏洞请按 [SECURITY.md](SECURITY.md) 私下报告。

## 稳定性约定

项目目前处于 1.0 之前。公共导出在同一个 minor 版本内应保持向后兼容；实验性设计器允许演进，但持久化 Schema 的变化必须提供 migration。废弃 API 至少保留一个 minor 版本后才能删除。

## License

正式公开仓库前必须补充项目许可证。在许可证缺失时，代码可见不等于获得开源使用许可。
