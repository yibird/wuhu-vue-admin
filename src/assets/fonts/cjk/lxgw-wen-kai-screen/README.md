![霞鹜文楷屏幕阅读版](https://cdn.jsdelivr.net/npm/cn-fontsource-lxgw-wen-kai-screen@1.0.6/font.png)

### 开源字体-推荐使用
> LICENSE: SIL Open Font License, Version 1.1

适用于浏览器的多片段快速加载的中文字库
- 本字体是 霞鹜文楷 的屏幕舒适阅读版本。由于原版「霞鹜文楷」Regular 字重在 PC 和 Android 屏幕上显示较细，将原版「霞鹜文楷 Bold」的字重属性改为 Regular，调整度量数据与 Android 默认字体 Roboto 相同，更适合 PC 及 Android 手机屏幕显示
LXGWWenKaiScreen.ttf： 使用文楷完整版字库，不以其他任何字体打底。
LXGWWenKaiScreenR.ttf： 在文楷完整版字库的基础上，使用 Roboto 打底补全缺失的字符，适合未 Root 的 Android 或 HarmonyOS 用户直接使用 （若可更换第三方字体） ，不会有音标等字符缺字的现象。但会有部分语言文字形态不统一。带 GB 的表示 GB 2312、通用规范汉字表范围内汉字为陆标字形，不带 GB 的为原版文楷的半陆标字形。
- 参见:  https://github.com/lxgw/LxgwWenKai-Screen
- 更多字体: WEB在线中文字体搜集:  https://github.com/wc-ex/cn-fontsource

![demo](https://cdn.jsdelivr.net/npm/cn-fontsource-lxgw-wen-kai-screen@1.0.6/demo.png)

### 信息
- version: Version 1.250;January 18, 2023
- familyName: LXGW WenKai Screen
- subfamilyName: Regular
- fullName: "LXGW WenKai Screen"
- characterCount: 28872

### 使用
- CDN 直接调用
  ```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/cn-fontsource-lxgw-wen-kai-screen/font.css"></link>
  <style>
    html{
      font-family: Roboto, "LXGW WenKai Screen", sans-serif;
    }
  </style>
  ```
- 本地化
  > npm i cn-fontsource-lxgw-wen-kai-screen

  > 加载: font.css

