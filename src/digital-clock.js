class DigitalClock {
    constructor({ color, fontFamily, fontWeight, fontSize, showSeconds, showMilliseconds, showShadow }) {
        const type = 'time'
        const show = '2-digit';
        const locales = 'nu';
        const options = {
            hour: show,
            minute: show,
            hour12: false,
        }
        let format = 'HH:mm';
        if (showSeconds) {
            format += ':ss'
            options.second = show;
        }
        if (showMilliseconds) {
            format += '.SSS'
        }
        this.element = document.createElement('input');
        this.element.setAttribute('type', type);
        this.element.setAttribute('readonly', true);
        this.element.setAttribute('format', format);
        if (showSeconds || showMilliseconds) {
            this.element.setAttribute('step', 1);
        }
        this.showSeconds = showSeconds;
        this.showMilliseconds = showMilliseconds;
        this.options = options;
        this.locales = locales;

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
    }
    draw() {
        const now = new Date();
        let time = now.toLocaleTimeString(this.locales, this.options);
        if (this.showMilliseconds) {
            time += `.${now.getMilliseconds()}`;
        }
        this.update(time);
    }
    update(time) {
        this.element.value = time;
    }
}

export default DigitalClock
