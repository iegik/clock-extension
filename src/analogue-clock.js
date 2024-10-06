const memoize = (fn) => {
    const cache = new Map();

    return (arg) => {
        if(cache.get(arg)) return cache.get(arg);
        return cache.set(arg, fn(arg)).get(arg);
    }
}

const calculateHours = memoize(hours => `rotate(${(360 / 12 * hours).toFixed(1)}deg)`);
const calculateMinutes = memoize(minutes => `rotate(${(360 / 60 * minutes).toFixed(1)}deg)`);
const calculateSeconds = memoize(seconds => `rotate(${(360 / 60 * seconds).toFixed(1)}deg)`);

class AnalogueClock {
    constructor({ element, color, size, showSeconds, hoursArrow, minutesArrow, secondsArrow }) {
        this.element = element;
        this.hoursArrow = hoursArrow;
        this.minutesArrow = minutesArrow;
        this.secondsArrow = secondsArrow;
        this.showSeconds = showSeconds;

        if (!this.showSeconds) {
            this.secondsArrow.style.display = 'none';
        }
        if (element) element.setAttribute('color', color)
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
        this.setProperty('hours', hours)
        this.setProperty('minutes', minutes)
        if(this.showSeconds) this.setProperty('seconds', seconds)
    }
    setProperty(prop, value) {
        const { element } = this
        if (!element) return
        if (this[`${prop}Arrow`].style.transform === value) return;
        this[`${prop}Arrow`].style.transform = value
    }
}

export default AnalogueClock
