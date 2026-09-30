// INKWAVE localization runtime. Import this module once before creating the UI.
import { ZH_CN } from './locales/zh-CN.js';

export const LOCALES = { en: {}, 'zh-CN': ZH_CN };
export const DEFAULT_LOCALE = 'zh-CN';
let locale = localStorage.getItem('inkwave.locale') || DEFAULT_LOCALE;

export function setLocale(next) {
  locale = LOCALES[next] ? next : DEFAULT_LOCALE;
  localStorage.setItem('inkwave.locale', locale);
  document.documentElement.lang = locale;
  document.dispatchEvent(new CustomEvent('inkwave:locale', { detail: locale }));
  return locale;
}

export function getLocale() { return locale; }
export function t(key, fallback = key, vars = {}) {
  let value = LOCALES[locale]?.[key] ?? fallback;
  return String(value).replace(/\\{(\\w+)\\}/g, (_, k) => vars[k] == null ? `{${k}}` : vars[k]);
}

// Translates text nodes created by the existing DOM-based UI without changing
// game identifiers, keyboard labels, or HTML/SVG markup.
export function installI18n(root = document.body) {
  document.documentElement.lang = locale;
  const translate = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const raw = node.nodeValue;
      const trimmed = raw.trim();
      if (!trimmed || !ZH_CN[trimmed]) return;
      node.nodeValue = raw.replace(trimmed, ZH_CN[trimmed]);
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE && !['SCRIPT', 'STYLE', 'SVG'].includes(node.tagName)) {
      [...node.childNodes].forEach(translate);
    }
  };
  const scan = () => translate(root);
  scan();
  const observer = new MutationObserver((records) => records.forEach((r) => r.addedNodes.forEach(translate)));
  observer.observe(root, { childList: true, subtree: true });
  document.addEventListener('inkwave:locale', scan);
  return () => { observer.disconnect(); document.removeEventListener('inkwave:locale', scan); };
}

// Side-effect entry point: importing this module enables Chinese immediately.
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => installI18n());
  else installI18n();
}
