// logger.js — 統一 LLM 除錯 Log
// 依 settings.debugLog 決定是否寫入 Console 與 chrome.storage.local。

import { getSettings } from './storage.js';

const MAX_LOGS = 100;

export async function debugLog(level, message, data) {
  const settings = await getSettings();
  if (!settings.debugLog) return;

  const entry = {
    t: new Date().toISOString(),
    level,
    message,
    data: sanitize(data),
  };

  // Console
  const tag = '[Shinkansen]';
  if (level === 'error') console.error(tag, message, data);
  else if (level === 'warn') console.warn(tag, message, data);
  else console.log(tag, message, data);

  // chrome.storage.local (環狀 100 筆）
  const { shinkansenLogs = [] } = await chrome.storage.local.get('shinkansenLogs');
  shinkansenLogs.push(entry);
  while (shinkansenLogs.length > MAX_LOGS) shinkansenLogs.shift();
  await chrome.storage.local.set({ shinkansenLogs });
}

function sanitize(data) {
  if (!data) return data;
  try {
    const s = JSON.stringify(data);
    return s.length > 2000 ? s.slice(0, 2000) + '…(截斷）' : JSON.parse(s);
  } catch {
    return String(data);
  }
}
