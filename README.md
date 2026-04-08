# Shinkansen 🚄

快速、流暢的 Chrome 網頁雙語翻譯擴充功能,使用 Google Gemini。

## 安裝方式(開發版)

1. 開啟 Chrome,網址列輸入 `chrome://extensions/` 並按 Enter。
2. 右上角打開「開發人員模式」。
3. 點「載入未封裝項目」(Load unpacked)。
4. 選擇本專案的 `shinkansen/` 資料夾。
5. 擴充功能清單會出現 Shinkansen,可以固定到工具列。

## 首次設定

1. 點工具列的 Shinkansen 圖示 → 「⚙ 設定」。
2. 貼上您的 Gemini API Key(取得:<https://aistudio.google.com/apikey>)。
3. 預設模型 `gemini-2.0-flash`、Service Tier `Flex`(省 50%)。
4. 按「儲存設定」。

## 使用方式

- **手動翻譯**:點工具列圖示 → 「翻譯本頁」
- **快捷鍵**:`Option + S` 切換目前分頁翻譯 / 還原
- **自動翻譯**:在設定頁白名單加入網域,進入該網站自動翻譯

## 目前版本

v0.1.0 (M2 骨架完成) — 下一步:M3 核心翻譯流程測試。

## 授權

僅供個人學習與使用。
