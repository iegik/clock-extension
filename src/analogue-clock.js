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
    constructor({ element, color, size, showMilliseconds, hoursArrow, minutesArrow, secondsArrow }) {
        this.element = element;
        this.hoursArrow = hoursArrow;
        this.minutesArrow = minutesArrow;
        this.secondsArrow = secondsArrow;
        this.showMilliseconds = showMilliseconds;

        this.setProperty('--color', color)

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
        this.setProperty('--transform-hours', hours)
        this.setProperty('--transform-minutes', minutes)
        this.setProperty('--transform-seconds', seconds)
    }
    setProperty(prop, value) {
        const { element } = this
        if (element.style.getPropertyValue(prop) === value) return;
        element.style.setProperty(prop, value)
    }
}

export default AnalogueClock
