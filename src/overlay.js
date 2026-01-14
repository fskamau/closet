/*
 * Closet - Purge distracting tabs instantly.
 * Copyright (C) 2026 fskamau
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 */

(function () {
  const api = typeof browser !== "undefined" ? browser : chrome;

  api.runtime.onMessage.addListener(msg => msg.action === "open_overlay" && renderUI());

  // Helper to create elements safely (pass dataset as a separate argument)
  const el = (tag, props = {}, children = [], data = {}) => {
    const e = Object.assign(document.createElement(tag), props);
    Object.entries(data).forEach(([k, v]) => e.dataset[k] = v);
    children.forEach(c => c && e.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
    return e;
  };

  function renderUI() {
    if (document.getElementById("purge-ovl")) return;

    const s = el("style", { textContent: `
      #purge-ovl { position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.6); backdrop-filter:blur(8px); z-index:2147483647; display:flex; justify-content:center; align-items:center; font-family:sans-serif; }
      #purge-box { width:85%; height:85%; background:#1a1a1a; border:2px solid #00ff2f; display:grid; grid-template-columns:1fr 1fr; gap:20px; padding:25px; border-radius:12px; box-sizing:border-box; color:white; box-shadow: 0 0 20px rgba(0,255,47,0.2); }
      .pane { background:#242424; padding:20px; border-radius:8px; overflow-y:auto; border:1px solid #333; }
      h2 { color:#00ff2f; margin:0 0 15px 0; border-bottom:1px solid #333; padding-bottom:10px; font-size: 1.2rem; }
      .row { display:flex; justify-content:space-between; align-items:center; padding:10px; margin-bottom:8px; background:#2d2d2d; border-radius:6px; min-height: 40px; }
      .btn { background:none; border:1px solid #00ff2f; color:#00ff2f; cursor:pointer; padding:6px 12px; border-radius:4px; font-weight:bold; transition: 0.2s; }
      .btn:hover { background:#00ff2f; color:#1a1a1a; }
      .btn.del { border-color:#ff4d4d; color:#ff4d4d; }
      .btn.del:hover { background:#ff4d4d; color:white; }
      .this-tab { color:#00ff2f; font-size:10px; border:1px solid #00ff2f; padding:2px 4px; margin-right:8px; border-radius:3px; font-weight: bold; }
    `});
    document.head.appendChild(s);

    const box = el("div", { id: "purge-box" });
    const ovl = el("div", { id: "purge-ovl" }, [box]);

    ovl.onclick = e => e.target === ovl && (ovl.remove(), s.remove());
    box.onclick = async e => {
      if (e.target.classList.contains("btn")) {
        await api.runtime.sendMessage({ action: "toggle", domain: e.target.dataset.d });
        refresh(box);
      }
    };

    document.body.appendChild(ovl);
    refresh(box);
  }

  async function refresh(box) {
    const { blocked, currentTabs } = await api.runtime.sendMessage({ action: "getData" });
    const blSet = new Set(blocked);
    box.textContent = "";

    const draw = (title, list, isBlk) => el("div", { className: "pane" }, [
      el("h2", { textContent: title }),
      ...list.map(d => el("div", { className: "row" }, [
        el("span", {}, [(!isBlk && d === currentTabs[0]) ? el("span", { className: "this-tab", textContent: "ACTIVE" }) : null, d]),
        el("button", { 
          className: `btn ${isBlk ? "del" : ""}`, 
          textContent: isBlk ? "Remove" : (blSet.has(d) ? "Unblock" : "Add")
        }, [], { d: d }) // Correctly passing data-d here
      ]))
    ]);

    box.append(draw("Blocked", blocked, true), draw("Current Tabs", currentTabs, false));
  }
})();