[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/gmhgmhcpllcnkdcanccmglkfifiakfma)](https://chrome.google.com/webstore/detail/clock-extension/gmhgmhcpllcnkdcanccmglkfifiakfma)
[![Mozilla Add-on](https://img.shields.io/amo/v/clock-extension)](https://addons.mozilla.org/en-US/firefox/addon/clock-extension/)

[demo](src/background.html)

**Day**
![](screenshot2.png)

**Night**
![](screenshot.png)

**Dark theme**
![](screenshot1.png)

**Options**
![](screenshot3.png)

- replaces [chrome://newtab]()
- night mode
- support systems dark / light theme switch
- 400x400px
- no leaks <sup id="a1">[1](#b1)</sup>
- no ads
- smooth clock arrow rotation
- customizable
- paused in background <sup id="a2">[1](#b2)</sup>

The [DS-Digital](https://www.dafont.com/ds-digital.font) font is used for digits

---
- <sup id="b1">1</sup> — Leak probability was minimized as far as possible [↩](#a1)
- <sup id="b2">2</sup> — [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) do not fully support occlusion by another window [Issue 715130](https://bugs.chromium.org/p/chromium/issues/detail?id=715130) [↩](#a2)