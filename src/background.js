var target;
if (typeof chrome !== 'undefined') target = chrome;
if (typeof browser !== 'undefined') target = browser;

async function reg() {
  const storage = target?.storage || storage;
  const idle = target?.idle;

  const isNightMode = (nightModeStart = 22, nightModeEnd = 10) => {
    const now = new Date().getHours();

    return now >= nightModeStart || now < nightModeEnd;
  };

  const syncStyleProperty =
    (element) =>
    ([attr, prop]) => {
      if (!element) return;
      const next = element.getAttribute(attr);
      const prev = element.style.getPropertyValue(prop);

      if (prev === next) return;
      element.style.setProperty(prop, next);
    };

  const mapping = {
    fill: '--background-color',
    color: '--color',
  };

  const watchAttributes = (element) => {
    if (!element) return;
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'attributes') {
          Object.entries(mapping).forEach(syncStyleProperty(mutation.target));
        }
      });
    });
    observer.observe(element, {
      attributes: true,
    });
    Object.entries(mapping).forEach(syncStyleProperty(element));
  };

  const defaultOptions = {
    rootSelector: '#clock',
    hoursArrowSelector: '#hoursArrow',
    minutesArrowSelector: '#minutesArrow',
    secondsArrowSelector: '#secondsArrow',
    analogueTheme: 'data/theme.html',
    typeOfClock: 'analogue',
    fontFamily: 'Digital-7 Mono, digital, monospace',
    fontWeight: 500,
    fontSize: '15vw',
    nightModeColor: '#c87f7f',
    dayModeColor: '#7f7f7f',
    opacity: 0.5,
    interval: 70, // milliseconds to draw seconds arrow
    size: 400, // diameter of analogue clock
    showSeconds: true,
    showMilliseconds: true,
    showShadow: false,
    nightModeStart: 22,
    nightModeEnd: 10,
  };
  let options =
    (await new Promise((resolve, reject) =>
      storage.sync.get(defaultOptions, resolve),
    )) || defaultOptions;

  // chrome.runtime.onInstalled.addListener(() => {
  const {
    analogueTheme,
    rootSelector,
    hoursArrowSelector,
    minutesArrowSelector,
    secondsArrowSelector,
    typeOfClock,
    nightModeColor,
    dayModeColor,
    fontFamily,
    fontWeight,
    fontSize,
    interval,
    size,
    opacity,
    showSeconds,
    showMilliseconds,
    showShadow,
    nightModeStart,
    nightModeEnd,
  } = options;

  const color = isNightMode(nightModeStart, nightModeEnd)
    ? nightModeColor + Math.round(255 * opacity).toString(16)
    : dayModeColor + Math.round(255 * opacity).toString(16);

  try {
    window;
  } catch (e) {
    return;
  }

  let stopped = document.hidden;
  let clock;
  let element;
  const root = document.querySelector('#root');

  if (typeOfClock === 'digital') {
    if (root)
      root.innerHTML =
        '<input id="clock" type="time" value="12:00:00" step="1" format="00:00:00" readonly />';
    element = document.querySelector(rootSelector);
    const { default: DigitalClock } = await import('./digital-clock.js');
    clock = new DigitalClock({
      element,
      color,
      fontFamily,
      fontWeight,
      fontSize,
      showSeconds,
      showMilliseconds,
      showShadow,
      color,
      size,
    });

    // hack to center not monospaced font
    clock.element.style.width = `${clock.element.offsetWidth}px`;
  } else {
    if (root)
      root.innerHTML = /==$/.test(analogueTheme) // check for Base64
        ? atob(analogueTheme)
        : /\.(svg|html)$/.test(analogueTheme)
        ? await fetch(analogueTheme).then((res) => res.text())
        : analogueTheme;

    element = document.querySelector(rootSelector);
    const { default: AnalogueClock } = await import('./analogue-clock.js');
    const hoursArrow = document.querySelector(hoursArrowSelector);
    const minutesArrow = document.querySelector(minutesArrowSelector);
    const secondsArrow = document.querySelector(secondsArrowSelector);

    clock = new AnalogueClock({
      element,
      hoursArrow,
      minutesArrow,
      secondsArrow,
      color,
      showSeconds,
      showShadow,
      color,
      size,
    });
  }

  watchAttributes(element);

  const requestAnimationFrame1 = () => requestAnimationFrame(frame);
  const frame = (time) => {
    if (stopped) return;
    clock.draw();
    setTimeout(requestAnimationFrame1, time + interval - performance.now());
  };

  const toggleClock = (hidden) => {
    // TIP: To avoid conflict blur and click (mouseup) events
    // 1. change click to mousedown
    // 2. wrap action into setTimeout
    setTimeout(() => {
      if (stopped === hidden) return;
      stopped = hidden === true;
      if (stopped) return;
      frame(document.timeline.currentTime);
    });
  };

  // TIP: Always check document.readyState when waiting DOMContentLoaded
  // https://stackoverflow.com/questions/43233115/chrome-content-scripts-arent-working-domcontentloaded-listener-does-not-execut
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', toggleClock);
  } else {
    toggleClock();
  }
  // Detecting loosing visibility on Alt+Tab
  // https://stackoverflow.com/questions/1060008/is-there-a-way-to-detect-if-a-browser-window-is-not-currently-active?rq=1
  window.addEventListener(
    'visibilitychange',
    () => {
      toggleClock(document.hidden);
    },
    false,
  );
  window.addEventListener('blur', () => {
    toggleClock(true);
  });
  window.addEventListener('focus', () => {
    toggleClock(false);
  });
  document.body.addEventListener('mousedown', () => {
    toggleClock(!stopped);
  });
  idle.onStateChanged.addListener((state) => {
    toggleClock(state !== 'active');
  });
  // });
}

function onInstalled({ reason }) {
  if (
    reason == chrome.runtime.OnInstalledReason.INSTALL ||
    reason == chrome.runtime.OnInstalledReason.UPDATE
  ) {
    // chrome.runtime.openOptionsPage();
    reg();
  }
}

target.runtime.onInstalled.addListener(function () {
  // Set initial enabled state in storage
  target.storage.sync.set({ enabled: true });
});

target.runtime.onInstalled.addListener(onInstalled);

try {
  reg();
} catch (e) {
  console.error(e)
}