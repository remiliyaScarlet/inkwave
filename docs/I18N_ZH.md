# 中文本地化

已在 `feature/i18n-chinese` 分支加入 `src/i18n.js` 与 `src/locales/zh-CN.js`。

`i18n.js` 提供 `t()`、`setLocale()`、`getLocale()` 和 `installI18n()`，并通过 DOM 观察器翻译现有菜单/HUD 动态文本。默认语言为简体中文，设置保存在 `localStorage` 的 `inkwave.locale` 中。

若要启用运行时，请在 `src/main.js` 的入口导入一次：

```js
import './i18n.js';
```

切换回英文：

```js
import { setLocale } from './i18n.js';
setLocale('en');
```
