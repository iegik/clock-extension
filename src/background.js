(async () => {
    const storage = chrome?.storage || storage;

    const isNightMode = (nightModeStart = 22, nightModeEnd = 10) => {
        const now = (new Date).getHours();

        return (now >= nightModeStart || now < nightModeEnd);
    }

    const defaultOptions = {
        rootSelector: '#clock',
        hoursArrowSelector: '#hoursArrow',
        minutesArrowSelector: '#minutesArrow',
        secondsArrowSelector: '#secondsArrow',
        analogueTheme: 'PGRpdgogICAgICBpZD0iY2xvY2siCiAgICAgIHN0eWxlPSJwb3NpdGlvbjogcmVsYXRpdmU7IGJvcmRlci1yYWRpdXM6IDUwJTsgd2lkdGg6IDQwMHB4OyBoZWlnaHQ6IDQwMHB4IgogICAgPgogICAgICA8c3R5bGU+CiAgICAgICAgI2Nsb2NrIGRpdiB7CiAgICAgICAgICBoZWlnaHQ6IDQwMHB4OwoKICAgICAgICAgIC8qIGRvdHMgZm9yIHNlY29uZHMsbWludXRlcyAqLwogICAgICAgICAgd2lkdGg6IDJweDsKICAgICAgICAgIGxlZnQ6IDE5OXB4OwogICAgICAgICAgcG9zaXRpb246IGFic29sdXRlOwogICAgICAgICAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyIGNlbnRlcjsKICAgICAgICAgIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCgKICAgICAgICAgICAgMGRlZywKICAgICAgICAgICAgcmdiYSgwLCAwLCAwLCAwKSAwJSwKICAgICAgICAgICAgcmdiYSgwLCAwLCAwLCAwKSAwJSwKICAgICAgICAgICAgdmFyKC0tY29sb3IpIDAlLAogICAgICAgICAgICB2YXIoLS1jb2xvcikgMC41JSwKICAgICAgICAgICAgcmdiYSgwLCAwLCAwLCAwKSAwLjUlCiAgICAgICAgICApCiAgICAgICAgfQogICAgICAgICNjbG9jayBkaXY6bnRoLWNoaWxkKC1uKzEyKSB7CiAgICAgICAgICAvKiBkb3RzIGZvciBtaW51dGVzICovCiAgICAgICAgICB3aWR0aDogNHB4OwogICAgICAgICAgbGVmdDogMTk4cHg7CiAgICAgICAgICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoCiAgICAgICAgICAgIDBkZWcsCiAgICAgICAgICAgIHJnYmEoMCwgMCwgMCwgMCkgMCUsCiAgICAgICAgICAgIHJnYmEoMCwgMCwgMCwgMCkgMCUsCiAgICAgICAgICAgIHZhcigtLWNvbG9yKSAwJSwKICAgICAgICAgICAgdmFyKC0tY29sb3IpIDElLAogICAgICAgICAgICByZ2JhKDAsIDAsIDAsIDApIDElCiAgICAgICAgICApOwogICAgICAgIH0KCiAgICAgICAgI2Nsb2NrICNob3Vyc0Fycm93IHsKICAgICAgICAgIC8qIGhvdXJzICovCiAgICAgICAgICB3aWR0aDogNnB4OwogICAgICAgICAgbGVmdDogMTk3cHg7CiAgICAgICAgICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoCiAgICAgICAgICAgIDBkZWcsCiAgICAgICAgICAgIHJnYmEoMCwgMCwgMCwgMCkgMCUsCiAgICAgICAgICAgIHJnYmEoMCwgMCwgMCwgMCkgNDUlLAogICAgICAgICAgICB2YXIoLS1jb2xvcikgNDUlLAogICAgICAgICAgICB2YXIoLS1jb2xvcikgNzAlLAogICAgICAgICAgICByZ2JhKDAsIDAsIDAsIDApIDcwJQogICAgICAgICAgKTsKICAgICAgICB9CiAgICAgICAgI2Nsb2NrICNtaW51dGVzQXJyb3cgewogICAgICAgICAgLyogbWludXRlcyAqLwogICAgICAgICAgd2lkdGg6IDRweDsKICAgICAgICAgIGxlZnQ6IDE5OHB4OwogICAgICAgICAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KAogICAgICAgICAgICAwZGVnLAogICAgICAgICAgICByZ2JhKDAsIDAsIDAsIDApIDAlLAogICAgICAgICAgICByZ2JhKDAsIDAsIDAsIDApIDQ1JSwKICAgICAgICAgICAgdmFyKC0tY29sb3IpIDQ1JSwKICAgICAgICAgICAgdmFyKC0tY29sb3IpIDg1JSwKICAgICAgICAgICAgcmdiYSgwLCAwLCAwLCAwKSA4NSUKICAgICAgICAgICk7CiAgICAgICAgfQogICAgICAgICNjbG9jayAjc2Vjb25kc0Fycm93IHsKICAgICAgICAgIC8qIHNlY29uZHMgKi8KICAgICAgICAgIHdpZHRoOiAycHg7CiAgICAgICAgICBsZWZ0OiAxOTlweDsKICAgICAgICAgIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCgKICAgICAgICAgICAgMGRlZywKICAgICAgICAgICAgcmdiYSgwLCAwLCAwLCAwKSAwJSwKICAgICAgICAgICAgcmdiYSgwLCAwLCAwLCAwKSA0NSUsCiAgICAgICAgICAgIHZhcigtLWNvbG9yKSA0NSUsCiAgICAgICAgICAgIHZhcigtLWNvbG9yKSA5NSUsCiAgICAgICAgICAgIHJnYmEoMCwgMCwgMCwgMCkgOTUlCiAgICAgICAgICApOwogICAgICAgIH0KICAgICAgPC9zdHlsZT4KICAgICAgPGRpdiBzdHlsZT0idHJhbnNmb3JtOiByb3RhdGUoLTkwZGVnKTsiPjwvZGl2PgogICAgICA8ZGl2IHN0eWxlPSJ0cmFuc2Zvcm06IHJvdGF0ZSgtNjBkZWcpOyI+PC9kaXY+CiAgICAgIDxkaXYgc3R5bGU9InRyYW5zZm9ybTogcm90YXRlKC0zMGRlZyk7Ij48L2Rpdj4KICAgICAgPGRpdiBzdHlsZT0idHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7Ij48L2Rpdj4KICAgICAgPGRpdiBzdHlsZT0idHJhbnNmb3JtOiByb3RhdGUoMzBkZWcpOyI+PC9kaXY+CiAgICAgIDxkaXYgc3R5bGU9InRyYW5zZm9ybTogcm90YXRlKDYwZGVnKTsiPjwvZGl2PgogICAgICA8ZGl2IHN0eWxlPSJ0cmFuc2Zvcm06IHJvdGF0ZSg5MGRlZyk7Ij48L2Rpdj4KICAgICAgPGRpdiBzdHlsZT0idHJhbnNmb3JtOiByb3RhdGUoMTIwZGVnKTsiPjwvZGl2PgogICAgICA8ZGl2IHN0eWxlPSJ0cmFuc2Zvcm06IHJvdGF0ZSgxNTBkZWcpOyI+PC9kaXY+CiAgICAgIDxkaXYgc3R5bGU9InRyYW5zZm9ybTogcm90YXRlKDE4MGRlZyk7Ij48L2Rpdj4KICAgICAgPGRpdiBzdHlsZT0idHJhbnNmb3JtOiByb3RhdGUoMjEwZGVnKTsiPjwvZGl2PgogICAgICA8ZGl2IHN0eWxlPSJ0cmFuc2Zvcm06IHJvdGF0ZSgyNDBkZWcpOyI+PC9kaXY+CiAgICAgIDxkaXYgc3R5bGU9InRyYW5zZm9ybTogcm90YXRlKC04NGRlZyk7Ij48L2Rpdj4KICAgICAgPGRpdiBzdHlsZT0idHJhbnNmb3JtOiByb3RhdGUoLTc4ZGVnKTsiPjwvZGl2PgogICAgICA8ZGl2IHN0eWxlPSJ0cmFuc2Zvcm06IHJvdGF0ZSgtNzJkZWcpOyI+PC9kaXY+CiAgICAgIDxkaXYgc3R5bGU9InRyYW5zZm9ybTogcm90YXRlKC02NmRlZyk7Ij48L2Rpdj4KICAgICAgPGRpdiBzdHlsZT0idHJhbnNmb3JtOiByb3RhdGUoLTU0ZGVnKTsiPjwvZGl2PgogICAgICA8ZGl2IHN0eWxlPSJ0cmFuc2Zvcm06IHJvdGF0ZSgtNDhkZWcpOyI+PC9kaXY+CiAgICAgIDxkaXYgc3R5bGU9InRyYW5zZm9ybTogcm90YXRlKC00MmRlZyk7Ij48L2Rpdj4KICAgICAgPGRpdiBzdHlsZT0idHJhbnNmb3JtOiByb3RhdGUoLTM2ZGVnKTsiPjwvZGl2PgogICAgICA8ZGl2IHN0eWxlPSJ0cmFuc2Zvcm06IHJvdGF0ZSgtMjRkZWcpOyI+PC9kaXY+CiAgICAgIDxkaXYgc3R5bGU9InRyYW5zZm9ybTogcm90YXRlKC0xOGRlZyk7Ij48L2Rpdj4KICAgICAgPGRpdiBzdHlsZT0idHJhbnNmb3JtOiByb3RhdGUoLTEyZGVnKTsiPjwvZGl2PgogICAgICA8ZGl2IHN0eWxlPSJ0cmFuc2Zvcm06IHJvdGF0ZSgtNmRlZyk7Ij48L2Rpdj4KICAgICAgPGRpdiBzdHlsZT0idHJhbnNmb3JtOiByb3RhdGUoNmRlZyk7Ij48L2Rpdj4KICAgICAgPGRpdiBzdHlsZT0idHJhbnNmb3JtOiByb3RhdGUoMTJkZWcpOyI+PC9kaXY+CiAgICAgIDxkaXYgc3R5bGU9InRyYW5zZm9ybTogcm90YXRlKDE4ZGVnKTsiPjwvZGl2PgogICAgICA8ZGl2IHN0eWxlPSJ0cmFuc2Zvcm06IHJvdGF0ZSgyNGRlZyk7Ij48L2Rpdj4KICAgICAgPGRpdiBzdHlsZT0idHJhbnNmb3JtOiByb3RhdGUoMzZkZWcpOyI+PC9kaXY+CiAgICAgIDxkaXYgc3R5bGU9InRyYW5zZm9ybTogcm90YXRlKDQyZGVnKTsiPjwvZGl2PgogICAgICA8ZGl2IHN0eWxlPSJ0cmFuc2Zvcm06IHJvdGF0ZSg0OGRlZyk7Ij48L2Rpdj4KICAgICAgPGRpdiBzdHlsZT0idHJhbnNmb3JtOiByb3RhdGUoNTRkZWcpOyI+PC9kaXY+CiAgICAgIDxkaXYgc3R5bGU9InRyYW5zZm9ybTogcm90YXRlKDY2ZGVnKTsiPjwvZGl2PgogICAgICA8ZGl2IHN0eWxlPSJ0cmFuc2Zvcm06IHJvdGF0ZSg3MmRlZyk7Ij48L2Rpdj4KICAgICAgPGRpdiBzdHlsZT0idHJhbnNmb3JtOiByb3RhdGUoNzhkZWcpOyI+PC9kaXY+CiAgICAgIDxkaXYgc3R5bGU9InRyYW5zZm9ybTogcm90YXRlKDg0ZGVnKTsiPjwvZGl2PgogICAgICA8ZGl2IHN0eWxlPSJ0cmFuc2Zvcm06IHJvdGF0ZSg5NmRlZyk7Ij48L2Rpdj4KICAgICAgPGRpdiBzdHlsZT0idHJhbnNmb3JtOiByb3RhdGUoMTAyZGVnKTsiPjwvZGl2PgogICAgICA8ZGl2IHN0eWxlPSJ0cmFuc2Zvcm06IHJvdGF0ZSgxMDhkZWcpOyI+PC9kaXY+CiAgICAgIDxkaXYgc3R5bGU9InRyYW5zZm9ybTogcm90YXRlKDExNGRlZyk7Ij48L2Rpdj4KICAgICAgPGRpdiBzdHlsZT0idHJhbnNmb3JtOiByb3RhdGUoMTI2ZGVnKTsiPjwvZGl2PgogICAgICA8ZGl2IHN0eWxlPSJ0cmFuc2Zvcm06IHJvdGF0ZSgxMzJkZWcpOyI+PC9kaXY+CiAgICAgIDxkaXYgc3R5bGU9InRyYW5zZm9ybTogcm90YXRlKDEzOGRlZyk7Ij48L2Rpdj4KICAgICAgPGRpdiBzdHlsZT0idHJhbnNmb3JtOiByb3RhdGUoMTQ0ZGVnKTsiPjwvZGl2PgogICAgICA8ZGl2IHN0eWxlPSJ0cmFuc2Zvcm06IHJvdGF0ZSgxNTZkZWcpOyI+PC9kaXY+CiAgICAgIDxkaXYgc3R5bGU9InRyYW5zZm9ybTogcm90YXRlKDE2MmRlZyk7Ij48L2Rpdj4KICAgICAgPGRpdiBzdHlsZT0idHJhbnNmb3JtOiByb3RhdGUoMTY4ZGVnKTsiPjwvZGl2PgogICAgICA8ZGl2IHN0eWxlPSJ0cmFuc2Zvcm06IHJvdGF0ZSgxNzRkZWcpOyI+PC9kaXY+CiAgICAgIDxkaXYgc3R5bGU9InRyYW5zZm9ybTogcm90YXRlKDE4NmRlZyk7Ij48L2Rpdj4KICAgICAgPGRpdiBzdHlsZT0idHJhbnNmb3JtOiByb3RhdGUoMTkyZGVnKTsiPjwvZGl2PgogICAgICA8ZGl2IHN0eWxlPSJ0cmFuc2Zvcm06IHJvdGF0ZSgxOThkZWcpOyI+PC9kaXY+CiAgICAgIDxkaXYgc3R5bGU9InRyYW5zZm9ybTogcm90YXRlKDIwNGRlZyk7Ij48L2Rpdj4KICAgICAgPGRpdiBzdHlsZT0idHJhbnNmb3JtOiByb3RhdGUoMjE2ZGVnKTsiPjwvZGl2PgogICAgICA8ZGl2IHN0eWxlPSJ0cmFuc2Zvcm06IHJvdGF0ZSgyMjJkZWcpOyI+PC9kaXY+CiAgICAgIDxkaXYgc3R5bGU9InRyYW5zZm9ybTogcm90YXRlKDIyOGRlZyk7Ij48L2Rpdj4KICAgICAgPGRpdiBzdHlsZT0idHJhbnNmb3JtOiByb3RhdGUoMjM0ZGVnKTsiPjwvZGl2PgogICAgICA8ZGl2IHN0eWxlPSJ0cmFuc2Zvcm06IHJvdGF0ZSgyNDZkZWcpOyI+PC9kaXY+CiAgICAgIDxkaXYgc3R5bGU9InRyYW5zZm9ybTogcm90YXRlKDI1MmRlZyk7Ij48L2Rpdj4KICAgICAgPGRpdiBzdHlsZT0idHJhbnNmb3JtOiByb3RhdGUoMjU4ZGVnKTsiPjwvZGl2PgogICAgICA8ZGl2IHN0eWxlPSJ0cmFuc2Zvcm06IHJvdGF0ZSgyNjRkZWcpOyI+PC9kaXY+CiAgICAgIDxkaXYgaWQ9ImhvdXJzQXJyb3ciIHN0eWxlPSJ0cmFuc2Zvcm06IHZhcigtLXRyYW5zZm9ybS1ob3Vycyk7Ij48L2Rpdj4KICAgICAgPGRpdiBpZD0ibWludXRlc0Fycm93IiBzdHlsZT0idHJhbnNmb3JtOiB2YXIoLS10cmFuc2Zvcm0tbWludXRlcyk7Ij48L2Rpdj4KICAgICAgPGRpdiBpZD0ic2Vjb25kc0Fycm93IiBzdHlsZT0idHJhbnNmb3JtOiB2YXIoLS10cmFuc2Zvcm0tc2Vjb25kcyk7Ij48L2Rpdj4KICAgIDwvZGl2Pg==',
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
    const { analogueTheme, rootSelector, hoursArrowSelector, minutesArrowSelector, secondsArrowSelector, typeOfClock, nightModeColor, dayModeColor, fontFamily, fontWeight, fontSize, interval, size, opacity, showSeconds, showMilliseconds, showShadow, nightModeStart, nightModeEnd } = options;

    const color = isNightMode(nightModeStart, nightModeEnd)
        ? nightModeColor + Math.round(255 * opacity).toString(16)
        : dayModeColor + Math.round(255 * opacity).toString(16);

    let stopped = document.hidden;
    let Clock
    const root = document.querySelector('#root')
    if (typeOfClock === 'digital') {
        const { default:DigitalClock } = await import('./digital-clock.js');
        root.innerHTML = '<input id="clock" type="time" value="12:00:00" step="1" format="00:00:00" readonly />'
        Clock = DigitalClock
    } else {
        const { default:AnalogueClock } = await import('./analogue-clock.js');
        root.innerHTML = atob(analogueTheme)
        Clock = AnalogueClock
    }

    const element = document.querySelector(rootSelector)
    const hoursArrow = document.querySelector(hoursArrowSelector);
    const minutesArrow = document.querySelector(minutesArrowSelector);
    const secondsArrow = document.querySelector(secondsArrowSelector);
    const clock = new Clock({ element, hoursArrow, minutesArrow, secondsArrow, color, fontFamily, fontWeight, fontSize, showSeconds, showMilliseconds, showShadow, color, size })

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