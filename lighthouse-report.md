# Lighthouse 测试报告

> 测试时间:2026-10-20
> 测试对象:本地 **生产构建**(`vite build` 产物,`dist/`)
> 工具:Lighthouse 13.5.0 + HeadlessChrome 156(Playwright Chromium)
> 说明:用本地静态服务器托管 `dist/`,开启了 gzip 与 `immutable` 长缓存;只桩了 `/v1/auth/session` 让受保护路由可渲染。没有 CDN、没有真实后端,因此**线上分数会与实际部署、网络环境有差异**,本报告主要用于横向对比与定位优化项。

## 总体结果

| 页面                  | 设备             | Performance | Accessibility | Best Practices | SEO |
| --------------------- | ---------------- | ----------: | ------------: | -------------: | --: |
| `/login`              | 移动端(默认模拟) |      **45** |            95 |            100 |  83 |
| `/login`              | 桌面端 1440×900  |      **91** |            95 |            100 |  83 |
| `/dashboard/analysis` | 移动端           |      **37** |            95 |            100 |  83 |
| `/dashboard/analysis` | 桌面端 1440×900  |      **61** |            92 |            100 |  83 |

## 核心指标

| 页面 / 设备       |   FCP |   LCP |         TBT |   CLS | Speed Index |   TTI | 传输体积 |
| ----------------- | ----: | ----: | ----------: | ----: | ----------: | ----: | -------: |
| login / 移动端    | 5.1 s | 7.1 s |      780 ms |     0 |       5.1 s | 7.1 s |  863 KiB |
| login / 桌面端    | 1.0 s | 1.5 s |      140 ms |     0 |       1.0 s | 1.5 s |  863 KiB |
| analysis / 移动端 | 5.1 s | 7.9 s | **1530 ms** |     0 |       5.1 s | 9.3 s |  872 KiB |
| analysis / 桌面端 | 1.1 s | 2.5 s |      460 ms | 0.015 |       2.1 s | 2.6 s | 1165 KiB |

分析页桌面端资源构成:脚本 1033 KiB / 42 个请求、样式 62 KiB / 9 个、字体 64 KiB / 2 个,共 59 个请求。

> 以上为优化前的基线数据。下方的「优化记录」列出了本轮改动与复测结果。

## 优化记录

### 已落地

| 改动                             | 说明                                                                                                                                                                                           | 验证                                                                                                 |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 登录页两个非默认面板改为异步组件 | `MobileLogin` / `QrcodeLogin` 由 `defineAsyncComponent` 按需加载;本地 `components/index.ts` 去掉这两个静态导出,否则 barrel 仍会把它们打进首包                                                  | 首屏脚本不再包含 `mobile-login` / `qrcode-login` chunk;切到「扫码登录」时 `qrcode-login-*.js` 才加载 |
| 分析页离屏暂停光束动画           | `BeamCard` 用 `IntersectionObserver`(`rootMargin: 160px`)在卡片离开视口时给 `.ant-border-beam::before` 加 `animation-play-state: paused`;`a-border-beam` 是无限动画,离屏后仍会持续占用渲染资源 | 滚动后 12 张卡片中 8 张处于暂停态,回到视口自动恢复                                                   |
| 分析页区块按视口异步挂载         | 每个卡片都是 `LazyContainer + Suspense + 异步组件`(`DeferredSection`),首屏只挂载可见区块                                                                                                       | canvas 数随滚动增加,骨架屏数量归零                                                                   |

### 试过但回退(无收益或有副作用)

- **antd 深层导入**(`antdv-next/dist/*/index`):把入口里的 `message` / `Modal` / `ConfigProvider` 换成子路径后,初始 JS 从 656.5 KiB 变为 660.7 KiB,**没有减少**,原因是模板里的 `a-*` 仍由 resolver 从包入口引入,整库仍被打进同一个共享 chunk。已回退,避免子路径耦合。
- **登录 Tabs 加 `destroy-on-hidden`**:antd Tabs 默认就是「首次激活才挂载、切走保留」,该属性没有带来加载收益,却会在切换页签时清空已输入的账号,已回退。

### 复测结果

| 页面                  | 设备   |         Performance |               LCP |                 TBT |
| --------------------- | ------ | ------------------: | ----------------: | ------------------: |
| `/login`              | 移动端 | **50**(3 次中位 57) | 6.9 s(中位 6.1 s) | 530 ms(中位 364 ms) |
| `/login`              | 桌面端 |              **92** |             1.5 s |              130 ms |
| `/dashboard/analysis` | 移动端 |              **40** |             7.6 s |             1090 ms |
| `/dashboard/analysis` | 桌面端 |              **84** |             1.9 s |              190 ms |

> 说明:移动端 Lighthouse 单次波动较大(同构建重复测量 ±5 分左右),`/login` 的移动端给出了 3 次中位数;分析页为单次测量。初始包 gzip 总量始终在 **656–661 KiB**,本轮改动没有改变首屏字节数,主要收益来自「不加载用不到的代码」与「暂停离屏动画」。

### 后续建议(按收益排序)

1. **拆分 antd 共享 chunk(最大头,532 KiB gzip)**:模板自动导入目前固定从 `antdv-next` 包入口引入,导致一个 chunk 承载全部用到的 antd 组件。要真正变小,需要自定义 resolver 把 `a-*` 映射到 `antdv-next/dist/<component>/index`(子组件需要回退到包入口),这是后续最值得做的一项。
2. **ECharts(253 KiB gzip)**:目前注册了 15 类图表,仅在图表页加载;可评估把图表类型注册拆到各页面按需注册。
3. **Univer / jit-viewer(10 MB 级别)**:已按路由懒加载,不需要进首屏;建议继续避免被 `@/components` barrel 或通用工具模块静态引入。
4. **未使用 CSS(46–62 KiB)**:全局 Uno 工具类与组件样式集中在入口 CSS,可评估按路由拆分样式入口。

## 主要问题

### 1. 未使用的 JavaScript(高优先级)

两个页面都提示约 **395–500 KB** 未执行代码,移动端预计可省 **1.8–2.2 s** TBT:

| 资源              |   体积 | 未使用 |
| ----------------- | -----: | -----: |
| `dist-*.js`       | 532 KB | 293 KB |
| `src-*.js`        | 253 KB | 146 KB |
| `components-*.js` |  61 KB |  35 KB |
| `vue-vendor-*.js` |  64 KB |  26 KB |

构建期也有一条警告:`assets/dist-*.js is 7.97 MB, and won't be precached`(PWA 预缓存上限)。说明存在一个体量很大的同步 chunk,建议:

- 用 `pnpm build:analyze` 定位 `dist-*.js` 里的大依赖,优先检查是否把重型组件/图标集/编辑器/图表库打进了首屏 chunk;
- 对非首屏模块坚持 `defineAsyncComponent` / 路由级懒加载(图表、编辑器、报表设计器这类已有异步先例);
- 关注 barrel 导入:`src/components/index.ts` 的转发容易把整棵依赖带进来。

### 2. 移动端主线程压力大(高优先级)

`analysis / 移动端` 主线程总耗时 **10.8 s**,其中:

- Other 4.2 s
- Style & Layout 3.1 s
- Script Evaluation 2.8 s
- 长任务 20 个,TBT 1530 ms,TTI 9.3 s

桌面端同页主线程 3.1 s、bootup 1.0 s。分析页首屏挂了 4 个 KPI 卡 + 经营趋势图 + 侧栏图表,并且每张卡片都有 `a-border-beam` 的无限动画。建议:

- 图表继续走 `LazyContainer` + 异步组件(已具备),但注意**已挂载的图表不会卸载**,滚动离开后仍在;
- 评估 `a-border-beam` 这类常驻装饰动画是否需要 `IntersectionObserver` 暂停(`animation-play-state`),或仅在可见时渲染;
- 拆分首屏:总览卡与图表不要同一帧全部初始化。

### 3. 可访问性

**通用问题**

- `button-name`:顶栏有若干纯图标按钮没有可访问名称(侧栏折叠按钮、工具栏的 tilt/其他图标按钮、顶部搜索按钮)。给这些按钮补 `aria-label`(或 `title` + `aria-label`)。
- `color-contrast`:侧边栏菜单文字(Dashboard / 分析页)与面包屑在主色背景/渐变上对比度不足;登录页的 Tab、主按钮文字也命中该规则。

**页面差异**

- `/login` 移动端:额外缺失 `landmark-one-main`(页面没有 `<main>` 地标)。
- `/dashboard/analysis` 桌面端:仅 `button-name` 与 `color-contrast`。

### 4. SEO(83 分)

- 缺少 `meta-description`;
- 缺少 `robots.txt`(本地静态服务未提供)。

对后台系统影响有限,但如果部署到公网,建议补上 `robots.txt` 与描述信息。

### 5. 未使用的 CSS(中低优先级)

`index-*.css` 约 **46–62 KB** 未被使用,移动端预计节省 150–310 ms。主要来自全局样式与组件库样式的全量引入,可考虑按需引入或拆分样式入口。

### 6. CLS(良好)

登录页与移动端分析页 CLS 均为 0;分析页桌面端 0.015,在可接受范围。

## 建议优先级

1. 处理首屏大 chunk(未使用 JS 395–500 KB):`pnpm build:analyze` 定位后按需拆分。
2. 移动端主线程:检查图表初始化与常驻动画,给装饰性动画加可见性暂停。
3. 可访问性:补图标按钮 `aria-label`、修正菜单/按钮文字对比度、登录页补 `<main>`。
4. 补 `robots.txt` 与 meta description。
5. 拆分未使用 CSS。

## 复现方式

```bash
# 1. 生产构建(当前仓库存在与本次改动无关的类型报错,故跳过 vue-tsc)
npx vite build

# 2. 托管 dist(需要 SPA fallback;受保护页面需桩 /v1/auth/session)
#    或使用: npx vite preview --port 4173

# 3. 运行 Lighthouse
npx lighthouse http://localhost:4174/login \
  --output=json --output-path=./login.json \
  --chrome-flags="--headless=new --no-sandbox --no-proxy-server"

# 4. 受保护页需要先在同源 localStorage 写入 token:
#    localStorage.setItem('token', '<token>')
```

> 注:本机存在系统 HTTP 代理,Chrome 需要加 `--no-proxy-server`,否则访问 localhost 会返回 502。
