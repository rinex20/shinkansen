// detector.js — 段落偵測規則（通用 + 四大網站）
// 目前 content.js 已內嵌通用版本，本檔作為 M3 擴充預留位置。
// 未來會針對 Gmail/Twitter/Wikipedia/Medium 提供網站專屬 selector。

export const SITE_RULES = {
  'mail.google.com': {
    root: 'div[role="main"]',
    include: ['div[dir="ltr"]', 'div.a3s'],
    exclude: ['.gmail_signature', 'blockquote.gmail_quote'],
  },
  'twitter.com': {
    root: 'main',
    include: ['article [lang]'],
    exclude: ['nav', 'aside'],
  },
  'x.com': {
    root: 'main',
    include: ['article [lang]'],
    exclude: ['nav', 'aside'],
  },
  'en.wikipedia.org': {
    root: '#mw-content-text',
    include: ['p', 'li', 'h2', 'h3', 'h4', 'blockquote'],
    exclude: ['.reference', '.mw-editsection', '#toc'],
  },
  'medium.com': {
    root: 'article',
    include: ['p', 'h1', 'h2', 'h3', 'blockquote', 'li'],
    exclude: ['figure figcaption'],
  },
};

export function matchSiteRule(hostname) {
  for (const key of Object.keys(SITE_RULES)) {
    if (hostname === key || hostname.endsWith('.' + key)) return SITE_RULES[key];
  }
  return null;
}
