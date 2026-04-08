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
    model: 'gemini-2.0-flash',
    serviceTier: 'DEFAULT',
    temperature: 0.3,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    systemInstruction: DEFAULT_SYSTEM_PROMPT,
  },
  // 計價設定（USD per 1M tokens)。預設值為 gemini-2.0-flash 的官方報價，
  // 使用者換模型時請自行至設定頁調整。
  pricing: {
    inputPerMTok: 0.10,
    outputPerMTok: 0.40,
  },
  targetLanguage: 'zh-TW',
  domainRules: { whitelist: [], blacklist: [] },
  autoTranslate: true,
  debugLog: false,
};

export async function getSettings() {
  const saved = await chrome.storage.sync.get(null);
  return {
    ...DEFAULT_SETTINGS,
    ...saved,
    geminiConfig: { ...DEFAULT_SETTINGS.geminiConfig, ...(saved.geminiConfig || {}) },
    pricing: { ...DEFAULT_SETTINGS.pricing, ...(saved.pricing || {}) },
    domainRules: { ...DEFAULT_SETTINGS.domainRules, ...(saved.domainRules || {}) },
  };
}

export async function setSettings(patch) {
  await chrome.storage.sync.set(patch);
}
