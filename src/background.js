(async () => {
    const storage = chrome?.storage || storage;

    const isNightMode = (nightModeStart = 22, nightModeEnd = 10) => {
        const now = (new Date).getHours();

        return (now >= nightModeStart || now < nightModeEnd);
    }

    const { default:DigitalClock } = await import('./digital-clock.js');
    const { default:AnalogueClock } = await import('./analogue-clock.js');

    let options = await new Promise((resolve, reject) => storage.sync.get({
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
    }, resolve)) || {};

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

    // frame(document.timeline.currentTime)

    document.body.addEventListener('click', () => {
        stopped = !stopped;
        if (stopped) return;
        frame(document.timeline.currentTime);
    });
    window.addEventListener('visibilitychange', () => {
        if (stopped === document.hidden) return;
        stopped = document.hidden;
        if (stopped) return;
        frame(document.timeline.currentTime);
    }, false);
    // });
})()