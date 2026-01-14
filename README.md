# Closet (Close Tabs) 🚀
![Extension Demo](/demo.png)
A tab management tool that automatically kills tabs from blocked domains. Avoid tab chasing by avoiding annoying redirects.

## Features
* **Kill-Switch:** Auto-closes tabs for domains in your blocklist the millisecond they try to load.
* **Universal Dashboard:** A sleek, blurred management overlay to toggle domains on and off.
* **Context Menu:** Right-click anywhere on a page to instantly "Closet" that domain.
* **Cross-Platform:** Native Manifest V3 logic compatible with Chrome, Firefox, and Edge.
* **Privacy First:** No tracking, no data collection, and zero external dependencies.

---

## How to Install (Developer Mode)

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/fskamau/closet.git
    ```
2.  **Set your browser:**
    * Open the `closet/src/` folder.

    * Locate the file for your browser (e.g., `manifest-firefox.json`).

    * Rename it to exactly `manifest.json` to activate it.
3.  **Open Extensions Page:**
    * **Chrome/Edge:** Go to `chrome://extensions` and toggle **Developer mode** (top right).
    * **Firefox:** Go to `about:debugging#/runtime/this-firefox`.
4.  **Load the Extension:**
    * **Chrome/Edge:** Click **Load unpacked** and select the `closet/src` folder.
    * **Firefox:** Click **Load Temporary Add-on...** and select the `manifest.json` file inside the `closet/src` folder.
5.  **Enjoy:** Your tabs are now being managed by `Closet`.

---

## How to Use 🛠️

Once installed, **Closet** provides two main ways to manage your digital space:

### 1. The Management Dashboard
Click the **Closet icon** in your browser toolbar (ensure it is "pinned" for quick access).
* **Overlay:** A dark, blurred dashboard will appear over your current page.
* **Current Tabs:** View all currently open domains. Click **Add** to block a domain instantly.
* **Blocked List:** View your active blocklist. Click **Remove** to allow a domain again.
* **Exit:** Simply click the background area to close the dashboard and return to your work.

### 2. The Right-Click "Purge"
If you stumble upon a distracting site:
* **Right-click** anywhere on the page.
* Select **"Add domain to Blocklist"**.
* The domain is added to your permanent blocklist which you can customize later.

---

## Support ☕

If **Closet** helps you stay productive and keep your browser clutter-free, consider supporting the development!

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/fskamau)

---

### Folder Structure
To ensure the extension loads correctly, maintain the following structure:
```text
closet/
├── README.md
├── demo.png
└── src/
    ├── manifest.json
    ├── background.js
    ├── overlay.js
    └── icons/
        ├── icon-16.png
        ├── icon-32.png
        ├── icon-48.png
        └── icon-128.png
