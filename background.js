(() => {
    const applyStyle = (el, style) => {
        const arr = Object.keys(style);
        arr.forEach(prop => {
            el.style[prop] = style[prop];
        });
    }

    const createArrow = ({ element, offset, length, width, color, baseSize }) => {
        applyStyle(element, {
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
    }
    
    const isNightMode = () => {
        const now = (new Date).getHours();

        return (now >= 22 || now < 10);
    }

    const size = 400;
    // const color = 'rgba(127,127,127,0.5)'; // gray
    // const color = 'rgb(230, 223, 139, 0.8)'; // gold
    // const color = 'rgb(127, 200, 127, 0.5)'; // green
    let started = true;
    const fonts = [
        'Digital-7 Mono, digital, monospace',
        'DS-Digital, digital, sans-serif',
        'Elektra, digital, sans-serif',
    ];
    const fontFamily = fonts[1];
    const options = {
        isDigital: false,
    }

    let drawer;
    if (options.isDigital) {
        const color = isNightMode()
            ? 'rgba(70,180,70,0.5)'
            : 'rgba(127,127,127,0.2)';
        const dgitalTime = document.createElement('div');
        applyStyle(dgitalTime, {
            position: 'absolute',
            top: `calc(60vh - ${size/2}px)`,
            left: `-50%`,
            marginLeft: `calc(100% - 2.5ex)`,
            color,
            fontFamily,
            fontDisplay: 'swap',
            fontSize: `15vw`,
            width: `100%`,
            // backgroundClip: 'text',
            // textShadow: `rgba(70,180,70,0.5) 0px 0.01em 0.01em,
            //     rgba(70,180,70,0.5) 0px 0.02em 0.05em,
            //     rgba(70,180,70,0.5) 0px 0.04em 0.15em`,
        });
    
        const changeDigitalTime = time => {
            dgitalTime.innerText = time;
        }
    
        const drawDigitalTime = () => {
            const now = new Date();
            // const miliseconds = now.getMilliseconds();
            // const time = `${now.toLocaleTimeString()}:${miliseconds}`;
            const time = now.toLocaleTimeString();
            changeDigitalTime(time);
        }

        drawer = drawDigitalTime;
        document.body.appendChild(dgitalTime);
    } else {
        const color = isNightMode()
            ? 'rgb(200, 127, 127, 0.5)'
            : 'rgba(127,127,127,0.5)';
        const clock = document.createElement('div');
        const hoursArrow = document.createElement('div');
        const minutesArrow = document.createElement('div');
        const secondsArrow = document.createElement('div');
    
        applyStyle(clock, {
            position: 'relative',
            //background: `${color}`,
            borderRadius: `50%`,
            //border: `${color} solid ${Math.round(size * 0.02)}px`,
            width: `${size}px`,
            height: `${size}px`,
            top: `calc(50vh - ${size/2}px)`,
            left: `calc(50vw - ${size/2}px)`,
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
            clock.appendChild(hourDot);
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
            clock.appendChild(hourDot);
        }
    
        const changeHours = hours => {
            hoursArrow.style.transform = `rotate(${360 / 12 * hours - 90}deg)`;
        }
        const changeMinutes = minutes => {
            minutesArrow.style.transform = `rotate(${360 / 60 * minutes - 90}deg)`;
        }
        const changeSeconds = seconds => {
            secondsArrow.style.transform = `rotate(${360 / 60 * seconds - 90}deg)`;
        }
    
        const drawAnalogueTime = () => {
            const now = new Date();
            const miliseconds = now.getMilliseconds();
            const seconds = now.getSeconds() + miliseconds * 0.001;
            const minutes = now.getMinutes() + 0.017 *  seconds;
            const hours = now.getHours() + 0.017 * minutes;
            changeHours(hours);
            changeMinutes(minutes);
            changeSeconds(seconds);
        }

        drawer = drawAnalogueTime;
        clock.appendChild(hoursArrow);
        clock.appendChild(minutesArrow);
        clock.appendChild(secondsArrow);
        document.body.appendChild(clock);
    }

    document.body.addEventListener('click', () => {
        started = !started;
        started && draw();
    });

    const draw = () => {
        drawer();
        started && requestAnimationFrame(draw);
    }
    draw();
})();
