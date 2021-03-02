(async () => {
    const isNightMode = (nightModeStart = 22, nightModeEnd = 10) => {
        const now = (new Date).getHours();

        return (now >= nightModeStart || now < nightModeEnd);
    }

    const memoize = (fn) => {
        const cache = new Map();

        return (arg) => {
            if(cache.get(arg)) return cache.get(arg);
            return cache.set(arg, fn(arg)).get(arg);
        }
    }

    const calculateHours = memoize(hours => `rotate(${360 / 12 * hours - 90}deg)`);
    const calculateMinutes = memoize(minutes => `rotate(${360 / 60 * minutes - 90}deg)`);
    const calculateSeconds = memoize(seconds => `rotate(${360 / 60 * seconds - 90}deg)`);

    const DigitalClock = {
        constructor({ color, fontFamily, fontWeight, fontSize, showSeconds, showMilliseconds, showShadow }) {
            const show = '2-digit';
            const options = {
                hour: show,
                minute: show,
            }
            let format = 'hh:mm';
            if (showSeconds) {
                format += ':ss'
                options.second = show;
            }
            if (showMilliseconds) {
                format += '.SSS'
            }
            this.element = document.createElement('input');
            this.element.setAttribute('type', 'time');
            this.element.setAttribute('readonly', true);
            this.element.setAttribute('format', format);
            if (showSeconds || showMilliseconds) {
                this.element.setAttribute('step', 1);
            }
            this.showSeconds = showSeconds;
            this.showMilliseconds = showMilliseconds;
            this.options = options;

            let root = document.documentElement;
            root.style.setProperty('--text-color', color);
            root.style.setProperty('--font-family', fontFamily);
            root.style.setProperty('--font-weight', fontWeight);
            root.style.setProperty('--font-size', fontSize);
            root.style.setProperty('--text-shadow', showShadow
                ? `var(--text-color) 0px 0.01em 0.01em,
                   var(--text-color) 0px 0.02em 0.05em,
                   var(--text-color) 0px 0.04em 0.15em`
                : 'none');
            // root.style.setProperty('--clock-width', showMilliseconds ? '80vw' : '45vw');

            this.draw();

            return this;
        },
        draw() {
            const now = new Date();
            let time = now.toLocaleTimeString([], this.options);
            if (this.showMilliseconds) {
                time += `.${now.getMilliseconds()}`;
            }
            this.update(time);
        },
        update(time) {
            this.element.value = time;
        },
    }

    const AnalogueClock = {
        createArrow({ element, offset, length, width, color, baseSize }) {
            Object.assign(element.style, {
                backgroundImage: `linear-gradient(90deg,
                    rgba(0,0,0,0) 0%,
                    rgba(0,0,0,0) ${offset * 100}%,
                    ${color} ${offset * 100}%,
                    ${color} ${(offset + length) * 100}%,
                    rgba(0,0,0,0) ${(offset + length) * 100}%
                )`,
                width: `${Math.round(baseSize)}px`,
                height: `${Math.round(baseSize * width)}px`,
                position: 'absolute',
                top: `${Math.round((baseSize - baseSize * width)/2)}px`,
                transformOrigin: `center center`,
            });
        },
        constructor({ color, size, showMilliseconds }) {
            this.element = document.createElement('div');
            this.hoursArrow = document.createElement('div');
            this.minutesArrow = document.createElement('div');
            this.secondsArrow = document.createElement('div');
            this.showMilliseconds = showMilliseconds;

            const { element, hoursArrow, minutesArrow, secondsArrow, createArrow } = this;

            Object.assign(element.style, {
                position: 'relative',
                borderRadius: `50%`,
                width: `${size}px`,
                height: `${size}px`,
            });

            createArrow({
                element: hoursArrow,
                offset: 0.45,
                length: 0.25,
                width: 0.015,
                color,
                baseSize: size
            });

            createArrow({
                element: minutesArrow,
                offset: 0.45,
                length: 0.40,
                width: 0.01,
                color,
                baseSize: size
            });

            createArrow({
                element: secondsArrow,
                offset: 0.45,
                length: 0.50,
                width: 0.005,
                color,
                baseSize: size
            });

            for (let deg = 0; deg < 360; deg += 30) {
                const hourDot = document.createElement('div');
                createArrow({
                    element: hourDot,
                    offset: 0,
                    length: 0.01,
                    width: 0.01,
                    color,
                    baseSize: size
                });
                hourDot.style.transform = `rotate(${deg - 90}deg)`;
                element.appendChild(hourDot);
            }

            for (let deg = 0; deg < 360; deg += 6) {
                if (deg % 30 === 0) continue;
                const hourDot = document.createElement('div');
                createArrow({
                    element: hourDot,
                    offset: 0,
                    length: 0.005,
                    width: 0.005,
                    color,
                    baseSize: size
                });
                hourDot.style.transform = `rotate(${deg - 90}deg)`;
                element.appendChild(hourDot);
            }

            element.appendChild(hoursArrow);
            element.appendChild(minutesArrow);
            element.appendChild(secondsArrow);

            return this;
        },
        draw() {
            const now = new Date();
            const milliseconds = now.getMilliseconds();
            const seconds = now.getSeconds() + milliseconds * 0.001;
            const minutes = now.getMinutes() + 0.017 *  seconds;
            const hours = now.getHours() + 0.017 * minutes;

            this.update(calculateHours(hours), calculateMinutes(minutes), calculateSeconds(seconds))
        },
        update(hours, minutes, seconds) {
            const { hoursArrow, minutesArrow, secondsArrow } = this;
            this.updateArrow(hoursArrow, hours)
            this.updateArrow(minutesArrow, minutes)
            this.updateArrow(secondsArrow, seconds)
        },
        updateArrow(arrow, value) {
            if (arrow.style.transform === value) return;
            arrow.style.transform = value;
        },
    }

    let options = await new Promise((resolve, reject) => chrome.storage.sync.get({
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
    }, resolve));

    try { window } catch (e) { return; }

    // chrome.runtime.onInstalled.addListener(() => {
    const { typeOfClock, nightModeColor, dayModeColor, fontFamily, fontWeight, fontSize, interval, size, opacity, showSeconds, showMilliseconds, showShadow, nightModeStart, nightModeEnd } = options;

    const color = isNightMode(nightModeStart, nightModeEnd)
        ? nightModeColor + Math.round(255 * opacity).toString(16)
        : dayModeColor + Math.round(255 * opacity).toString(16);

    let started = true;
    const clock = typeOfClock === 'digital'
        ? DigitalClock.constructor({ color, fontFamily, fontWeight, fontSize, showSeconds, showMilliseconds, showShadow })
        : AnalogueClock.constructor({ color, size });

    document.body.appendChild(clock.element);

    // hack to center not monospaced font
    if (typeOfClock === 'digital') {
        clock.element.style.width = `${clock.element.offsetWidth}px`
    }

    const start = document.timeline.currentTime;
    const requestAnimationFrame1 = () => requestAnimationFrame(frame)
    const frame = (time) => {
        const elapsed = time - start;
        const moment = Math.round(elapsed / interval);
        clock.draw(moment);
        const targetNext = (moment + 1) * interval + start;
        started && setTimeout(requestAnimationFrame1, targetNext - performance.now());
    }

    frame(start)

    document.body.addEventListener('click', () => {
        started = !started;
        started && frame();
    });
    document.addEventListener("visibilitychange", (event) => {
        started = event.target.visibilityState === 'visible';
    });
    // });
})()