(async () => {
    const storage = chrome?.storage || storage;

    const isNightMode = (nightModeStart = 22, nightModeEnd = 10) => {
        const now = (new Date).getHours();

        return (now >= nightModeStart || now < nightModeEnd);
    }

    const { default:DigitalClock } = await import('./digital-clock.js');
    const { default:AnalogueClock } = await import('./analogue-clock.js');

    const defaultOptions = {
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
        nightModeEnd: 10
    }
    let options = await new Promise((resolve, reject) => storage.sync.get(defaultOptions, resolve)) || defaultOptions;

    try { window } catch (e) { return; }

    // chrome.runtime.onInstalled.addListener(() => {
    const { typeOfClock, nightModeColor, dayModeColor, fontFamily, fontWeight, fontSize, interval, size, opacity, showSeconds, showMilliseconds, showShadow, nightModeStart, nightModeEnd } = options;

    const color = isNightMode(nightModeStart, nightModeEnd)
        ? nightModeColor + Math.round(255 * opacity).toString(16)
        : dayModeColor + Math.round(255 * opacity).toString(16);

    let stopped = document.hidden;
    const Clock = typeOfClock === 'digital'
        ? DigitalClock
        : AnalogueClock

    const clock = new Clock({ color, fontFamily, fontWeight, fontSize, showSeconds, showMilliseconds, showShadow, color, size })

    document.body.appendChild(clock.element);

    // hack to center not monospaced font
    if (typeOfClock === 'digital') {
        clock.element.style.width = `${clock.element.offsetWidth}px`
    }

    const requestAnimationFrame1 = () => requestAnimationFrame(frame)
    const frame = (time) => {
        if (stopped) return;
        clock.draw();
        setTimeout(requestAnimationFrame1, time + interval - performance.now());
    }

    const toggleClock = (hidden) => {
        // TIP: To avoid conflict blur and click (mouseup) events
        // 1. change click to mousedown
        // 2. wrap action into setTimeout
        setTimeout(() => {
            if (stopped === hidden) return;
            stopped = hidden === true;
            if (stopped) return;
            frame(document.timeline.currentTime);
        })
    }

    // TIP: Always check document.readyState when waiting DOMContentLoaded
    // https://stackoverflow.com/questions/43233115/chrome-content-scripts-arent-working-domcontentloaded-listener-does-not-execut
    if(document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', toggleClock);
    } else {
        toggleClock();
    }
    // Detecting loosing visibility on Alt+Tab
    // https://stackoverflow.com/questions/1060008/is-there-a-way-to-detect-if-a-browser-window-is-not-currently-active?rq=1
    window.addEventListener('visibilitychange', () => { toggleClock(document.hidden); }, false);
    window.addEventListener('blur', () => { toggleClock(true); })
    window.addEventListener('focus', () => { toggleClock(false); })
    document.body.addEventListener('mousedown', () => { toggleClock(!stopped); });
    // });
})()