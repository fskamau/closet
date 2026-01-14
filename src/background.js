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
const api = typeof browser !== "undefined" ? browser : chrome;

const getDomain = (url) => {
  try { return new URL(url).hostname; } catch (e) { return null; }
};

api.runtime.onInstalled.addListener(() => {
  api.contextMenus.create({
    id: "add-purge",
    title: "Add domain to Blocklist",
    contexts: ["all"]
  });
});

api.contextMenus.onClicked.addListener(async (info, tab) => {

  const domain = getDomain(tab.url);
    console.log(tab.url,domain);
  if (domain) {
    const data = await api.storage.local.get({ blockedUrls: [] });
    const blocked = new Set(data.blockedUrls);
    blocked.add(domain);
    await api.storage.local.set({ blockedUrls: [...blocked] });
  }
});

api.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0) return;
  const domain = getDomain(details.url);
  const data = await api.storage.local.get({ blockedUrls: [] });
  if (domain && data.blockedUrls.includes(domain)) {
    api.tabs.remove(details.tabId).catch(() => {});
  }
});

const actionAPI = api.action || api.browserAction;
actionAPI.onClicked.addListener((tab) => {
    api.tabs.sendMessage(tab.id, { action: "open_overlay" }).catch(() => {});
});

api.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getData") {
    (async () => {
      const data = await api.storage.local.get({ blockedUrls: [] });
      const allTabs = await api.tabs.query({});
      const currentDomain = sender.tab ? getDomain(sender.tab.url) : null;
      
      let domains = [...new Set(allTabs.map(t => getDomain(t.url)).filter(d => d))];
      domains.sort((a, b) => (a === currentDomain ? -1 : b === currentDomain ? 1 : a.localeCompare(b)));

      sendResponse({ blocked: data.blockedUrls, currentTabs: domains });
    })();
    return true;
  }

  if (msg.action === "toggle") {
    (async () => {
      const data = await api.storage.local.get({ blockedUrls: [] });
      let blocked = new Set(data.blockedUrls);
      blocked.has(msg.domain) ? blocked.delete(msg.domain) : blocked.add(msg.domain);
      await api.storage.local.set({ blockedUrls: [...blocked] });
      sendResponse({ success: true });
    })();
    return true;
  }
});