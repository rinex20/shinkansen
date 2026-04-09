# Pending Regression Tests

> **這是什麼**：待補的 regression test 清單。每筆代表「bug 已修但對應的
> regression spec 還沒寫」(對應 CLAUDE.md 硬規則 9 的路徑 B fallback)。
>
> **誰會讀**：
>   - **Cowork 端** 每次新對話會檢查本檔,若非空必須在第一句話提醒 Jimmy
>     (CLAUDE.md「開始新對話時的標準動作」第 4 步)
>   - **Claude Code 端** 跑完 `npm test` 全綠後若本檔非空,必須主動提醒
>   - **Jimmy** 看到提醒後可以決定要立刻清,還是先繼續手上的事
>
> **怎麼清**：見 `測試流程說明.md` 的「指令 G:清 pending regression queue」。
>
> **空 queue 的判斷**：本檔只剩本段 header + 「(目前沒有 pending 條目)」
> 那行 placeholder = 空。任何在「## 條目」section 之下的內容都算待清。

---

## 條目

### v0.82 — 2026-04-09 — SPA 動態載入內容支援
- **功能描述**：SPA 導航偵測（pushState/replaceState/popstate）+ 翻譯後 MutationObserver
- **來源 URL**：Twitter/X（SPA 導航）、任何 lazy-load 內容的頁面
- **修在**：shinkansen/content.js 的 `handleSpaNavigation`、`resetForSpaNavigation`、`startSpaObserver`、`spaObserverRescan`
- **為什麼還不能寫測試**：
    SPA 導航偵測需要真正的 pushState 環境（靜態 fixture 做不到），
    MutationObserver 需要模擬動態新增 DOM 節點。需要一個可以
    programmatically 觸發 pushState 並在 callback 後新增 DOM 的測試頁面，
    且需要 mock chrome.storage.sync 的 domainRules。等切到 Claude Code 端
    再設計適當的 test harness。
- **建議 spec 位置**：test/regression/spa-navigation.spec.js
- **建議測試場景**：
    1. pushState 後 STATE 被重置（translated = false, originalHTML 清空）
    2. MutationObserver 偵測到新增段落後觸發 rescan
    3. MutationObserver 達到 MAX_RESCANS 後自動停止
    4. restorePage 後 Observer 被 disconnect

<!--
條目格式範例(實際加入時把上面那行 placeholder 刪掉):

### v0.60 — 2026-04-12 — 簡短描述 bug
- **症狀**:Jimmy 觀察到的現象 (例如「Substack 卡片標題被吃掉變空字串」)
- **來源 URL**:https://example.com/some-page (若為公開頁面)
- **修在**:shinkansen/content.js 的 XX 函式 / commit hash
- **為什麼還不能寫測試**:
    例:還沒抽出最小重現結構;原頁面太複雜、含三層 wrapper + 動態載入,
    需要再觀察是哪個 attribute 是真正觸發條件
- **建議 spec 位置**:test/regression/inject-substack-title.spec.js
- **建議 fixture 結構**(若已知):
    ```html
    <article>
      <h2 class="...">
        <span>...</span>
      </h2>
    </article>
    ```
-->
