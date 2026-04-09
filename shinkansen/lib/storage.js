// storage.js — 設定讀寫封裝

const DEFAULT_SYSTEM_PROMPT = `你是一位專業的翻譯助理。請將使用者提供的文字翻譯成繁體中文（台灣用語），遵守以下規則：
1. 只輸出譯文，不要加任何解釋、前言或後記。
2. 保留原文中的專有名詞、產品名、人名、程式碼、網址、數字與符號。
3. 使用台灣慣用的翻譯（例如 software → 軟體、而非「軟件」;database → 資料庫、而非「數據庫」)。
4. 若輸入包含多段文字（以特定分隔符號區隔），請逐段翻譯並以相同分隔符號輸出。
5. 語氣自然流暢，避免直譯與機械感。`;

export const DEFAULT_SETTINGS = {
  apiKey: '',
  geminiConfig: {
    model: 'gemini-2.5-flash',
    serviceTier: 'DEFAULT',
    temperature: 1.0,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    systemInstruction: DEFAULT_SYSTEM_PROMPT,
  },
  // 計價設定（USD per 1M tokens)。預設值為 gemini-2.5-flash 的官方報價，
  // 使用者換模型時請自行至設定頁調整。
  pricing: {
    inputPerMTok: 0.30,
    outputPerMTok: 2.50,
  },
  targetLanguage: 'zh-TW',
  domainRules: { whitelist: [], blacklist: [] },
  autoTranslate: true,
  debugLog: false,
  // v0.35 新增：並行翻譯 rate limiter 設定
  // tier 對應 Gemini API 付費層級(free / tier1 / tier2),決定 RPM/TPM/RPD 上限
  // override 欄位若為 null 則使用 tier 對照表的值,非 null 時覆寫
  tier: 'tier1',
  safetyMargin: 0.1,
  maxRetries: 3,
  rpmOverride: null,
  tpmOverride: null,
  rpdOverride: null,
  // 每個 tab 同時最多飛出幾個翻譯批次(content.js 側的並發上限,與 limiter 雙重保險)
  maxConcurrentBatches: 10,
};

// v0.62 起：apiKey 改存 chrome.storage.local，不走 Google 帳號跨裝置同步。
// 其餘設定仍存 sync。對下游呼叫端完全透明——getSettings() 回傳的物件
// 依然有 .apiKey 欄位。
const API_KEY_STORAGE_KEY = 'apiKey';

// 一次性遷移：若 sync 裡還殘留 apiKey（舊版 <= v0.61 的使用者）、而 local
// 還沒有，就把它搬到 local 並從 sync 刪除。呼叫 getSettings() 會自動觸發。
async function migrateApiKeyIfNeeded(syncSaved) {
  if (!syncSaved || typeof syncSaved.apiKey !== 'string') return;
  const { [API_KEY_STORAGE_KEY]: localKey } = await chrome.storage.local.get(API_KEY_STORAGE_KEY);
  if (!localKey && syncSaved.apiKey) {
    // sync 有、local 沒有 → 搬過去
    await chrome.storage.local.set({ [API_KEY_STORAGE_KEY]: syncSaved.apiKey });
  }
  // 無論 local 原本有沒有，都要把 sync 裡的 apiKey 清掉（避免之後又被同步回來）
  await chrome.storage.sync.remove('apiKey');
}

export async function getSettings() {
  const saved = await chrome.storage.sync.get(null);
  await migrateApiKeyIfNeeded(saved);
  // 從 local 讀 apiKey（v0.62 起的正規位置）
  const { [API_KEY_STORAGE_KEY]: apiKey = '' } = await chrome.storage.local.get(API_KEY_STORAGE_KEY);
  // saved.apiKey 可能還在（migrate 剛剛才刪），以 local 版本為準
  const merged = {
    ...DEFAULT_SETTINGS,
    ...saved,
    geminiConfig: { ...DEFAULT_SETTINGS.geminiConfig, ...(saved.geminiConfig || {}) },
    pricing: { ...DEFAULT_SETTINGS.pricing, ...(saved.pricing || {}) },
    domainRules: { ...DEFAULT_SETTINGS.domainRules, ...(saved.domainRules || {}) },
  };
  merged.apiKey = apiKey;
  return merged;
}

export async function setSettings(patch) {
  // 若 patch 含 apiKey，抽出來寫 local；其餘寫 sync
  if (patch && Object.prototype.hasOwnProperty.call(patch, 'apiKey')) {
    const { apiKey, ...rest } = patch;
    await chrome.storage.local.set({ [API_KEY_STORAGE_KEY]: apiKey });
    if (Object.keys(rest).length > 0) {
      await chrome.storage.sync.set(rest);
    }
  } else {
    await chrome.storage.sync.set(patch);
  }
}
