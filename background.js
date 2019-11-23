(() => {
  const clock = document.createElement('div');
  const hoursArrow = document.createElement('div');
  const minutesArrow = document.createElement('div');
  const secondsArrow = document.createElement('div');
  const dgitalTime = document.createElement('div');

  const applyStyle = (el, style) => {
      const arr = Object.keys(style);
  arr.forEach(prop => {
    el.style[prop] = style[prop];
      });
  }

  const size = 400;
  // const color = 'rgba(127,127,127,0.5)'; // gray
  // const color = 'rgb(230, 223, 139, 0.8)'; // gold
  // const color = 'rgb(127, 200, 127, 0.5)'; // green
  const now = (new Date).getHours();
  const color = (now >= 22 || now < 10)
    ? 'rgb(200, 127, 127, 0.5)'
    : 'rgba(127,127,127,0.5)';
  let started = true;

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

  applyStyle(dgitalTime, {
      position: 'absolute',
      top: `calc(60vh - ${size/2}px)`,
      left: `-50%`,
      marginLeft: `calc(100% - 2.5ex)`,
      color: 'rgba(127,127,127,0.2)',
      fontFamily: 'DS-Digital, monospace',
      fontSize: `8vh`,
      width: `100%`,
      //textAlign: 'center'
  });

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
  const changeDigitalTime = time => {
    dgitalTime.innerText = time;
  }

  const draw = () => {
      const now = new Date();
      const miliseconds = now.getMilliseconds();
      const seconds = now.getSeconds() + miliseconds * 0.001;
      const minutes = now.getMinutes() + 0.017 *  seconds;
      const hours = now.getHours() + 0.017 * minutes;
      // const time = `${now.toLocaleTimeString()}:${miliseconds}`;
      const time = now.toLocaleTimeString();
      changeHours(hours);
      changeMinutes(minutes);
      changeSeconds(seconds);
      changeDigitalTime(time);

      started && requestAnimationFrame(draw);
  }

  clock.addEventListener('click', () => {
      started = !started;
      started && draw();
  });

  clock.appendChild(dgitalTime);
  clock.appendChild(hoursArrow);
  clock.appendChild(minutesArrow);
  clock.appendChild(secondsArrow);

  document.body.appendChild(clock);
  draw();
})();
