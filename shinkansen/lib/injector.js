// injector.js — DOM 雙語插入邏輯（M3+ 擴充用）
// v0.1 content.js 已內嵌基本版本。此檔保留給複雜插入策略（表格、清單、行內樣式保留）使用。

export function insertBilingualBlock(el, translation) {
  const box = document.createElement('div');
  box.className = 'shinkansen-translation';
  box.textContent = translation;
  el.after(box);
  return box;
}
