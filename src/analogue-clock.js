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

class AnalogueClock {
    createArrow({ element, offset, length, thickness, color, baseSize }) {
        Object.assign(element.style, {
            backgroundImage: `linear-gradient(0deg,
                rgba(0,0,0,0) 0%,
                rgba(0,0,0,0) ${offset * 100}%,
                ${color} ${offset * 100}%,
                ${color} ${(offset + length) * 100}%,
                rgba(0,0,0,0) ${(offset + length) * 100}%
            )`,
            height: `${Math.round(baseSize)}px`,
            width: `${Math.round(baseSize * thickness)}px`,
            position: 'absolute',
            left: `${Math.round((baseSize - baseSize * thickness)/2)}px`,
            transformOrigin: `center center`,
        });
    }
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
            thickness: 0.015,
            color,
            baseSize: size
        });

        createArrow({
            element: minutesArrow,
            offset: 0.45,
            length: 0.40,
            thickness: 0.01,
            color,
            baseSize: size
        });

        createArrow({
            element: secondsArrow,
            offset: 0.45,
            length: 0.50,
            thickness: 0.005,
            color,
            baseSize: size
        });

        for (let deg = 0; deg < 360; deg += 30) {
            const hourDot = document.createElement('div');
            createArrow({
                element: hourDot,
                offset: 0,
                length: 0.01,
                thickness: 0.01,
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
                thickness: 0.005,
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
    }
    draw() {
        const now = new Date();
        const milliseconds = now.getMilliseconds();
        const seconds = now.getSeconds() + milliseconds * 0.001;
        const minutes = now.getMinutes() + 0.017 *  seconds;
        const hours = now.getHours() + 0.017 * minutes;

        this.update(calculateHours(hours), calculateMinutes(minutes), calculateSeconds(seconds))
    }
    update(hours, minutes, seconds) {
        const { hoursArrow, minutesArrow, secondsArrow } = this;
        this.updateArrow(hoursArrow, hours)
        this.updateArrow(minutesArrow, minutes)
        this.updateArrow(secondsArrow, seconds)
    }
    updateArrow(arrow, value) {
        if (arrow.style.transform === value) return;
        arrow.style.transform = value;
    }
}

export default AnalogueClock
