(function () {
  const api = typeof browser !== "undefined" ? browser : chrome;

  api.runtime.onMessage.addListener((msg) => {
    if (msg.action === "open_overlay") renderUI();
  });

  function renderUI() {
    if (document.getElementById("purge-ovl")) return;

    const s = document.createElement("style");
    s.textContent = `
      #purge-ovl { position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.5); backdrop-filter:blur(10px); z-index:2147483647; display:flex; justify-content:center; align-items:center; font-family:sans-serif; }
      #purge-box { width:80%; height:80%; background:#222; border:2px solid #00ff2f; display:grid; grid-template-columns:1fr 1fr; gap:20px; padding:25px; border-radius:12px; box-sizing:border-box; color:white; }
      .pane { background:#2b2929; padding:20px; border-radius:8px; overflow-y:auto; border:1px solid #313030; }
      h2 { color:#00ff2f; margin:0 0 15px 0; border-bottom:1px solid #313030; padding-bottom:10px; }
      .row { display:flex; justify-content:space-between; align-items:center; padding:8px; margin:5px 0; background:#313030; border-radius:4px; }
      .btn { background:none; border:1px solid #00ff2f; color:#00ff2f; cursor:pointer; padding:4px 8px; border-radius:4px; font-weight:bold; }
      .btn:hover { background:#00ff2f; color:#222; }
      .btn.del { border-color:#ff4d4d; color:#ff4d4d; }
      .btn.del:hover { background:#ff4d4d; color:white; }
      .this-tab { color:#00ff2f; font-size:10px; border:1px solid #00ff2f; padding:2px; margin-right:5px; border-radius:3px; }
    `;
    document.head.appendChild(s);

    const ovl = document.createElement("div");
    ovl.id = "purge-ovl";
    const box = document.createElement("div");
    box.id = "purge-box";

    ovl.onclick = (e) => { if (e.target === ovl) { ovl.remove(); s.remove(); } };
    
    box.onclick = async (e) => {
      if (e.target.classList.contains("btn")) {
        await api.runtime.sendMessage({ action: "toggle", domain: e.target.dataset.d });
        refresh(box);
      }
    };

    ovl.appendChild(box);
    document.body.appendChild(ovl);
    refresh(box);
  }

  async function refresh(box) {
    const data = await api.runtime.sendMessage({ action: "getData" });
    const blocked = new Set(data.blocked);
    const current = data.currentTabs[0];

    const makeList = (list, isBlocked) => list.map(d => `
      <div class="row">
        <span>${(!isBlocked && d === current) ? '<span class="this-tab">ACTIVE</span>' : ''}${d}</span>
        <button class="btn ${isBlocked ? 'del' : ''}" data-d="${d}">${isBlocked ? 'Remove' : (blocked.has(d) ? 'Unblock' : 'Add')}</button>
      </div>
    `).join('');

    box.innerHTML = `
      <div class="pane"><h2>Blocked</h2>${makeList(data.blocked, true)}</div>
      <div class="pane"><h2>Current Tabs</h2>${makeList(data.currentTabs, false)}</div>
    `;
  }
})();