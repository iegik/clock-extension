const storage = chrome?.storage || storage;

const getRadioValue = (name) => {
  const current = [].find.call(document.getElementsByName(name), ({ checked }) => checked)
  return current ? current.value : null;
}
const setRadioValue = (name, value) => [].map.call(document.getElementsByName(name), (item) => {
  console.log({ checked: item.checked, oldValue: item.value, newValue: value});
  return item.checked = (item.value === value)
});

// Saves options to storage
function save_options(...args) {
  const typeOfClock = getRadioValue('typeOfClock');
  const fontFamily = document.getElementsByName('fontFamily')[0].value;
  const fontWeight = document.getElementsByName('fontWeight')[0].value;
  const fontSize = document.getElementsByName('fontSize')[0].value;
  const nightModeColor = document.getElementsByName('nightModeColor')[0].value;
  const dayModeColor = document.getElementsByName('dayModeColor')[0].value;
  const opacity = parseFloat(document.getElementsByName('opacity')[0].value);
  const interval = parseInt(document.getElementsByName('interval')[0].value);
  const size = parseInt(document.getElementsByName('size')[0].value);
  const showSeconds = document.getElementsByName('showSeconds')[0].checked;
  const showMilliseconds = document.getElementsByName('showMilliseconds')[0].checked;
  const showShadow = document.getElementsByName('showShadow')[0].checked;
  const nightModeStart = document.getElementsByName('nightModeStart')[0].value;
  const nightModeEnd = document.getElementsByName('nightModeEnd')[0].value;

  storage.sync.set({
    typeOfClock,
    fontFamily,
    fontWeight,
    fontSize,
    nightModeColor,
    dayModeColor,
    opacity,
    interval,
    size,
    showSeconds,
    showMilliseconds,
    showShadow,
    nightModeStart,
    nightModeEnd
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Saved';
    status.style.display = 'grid';
    setTimeout(function() {
      status.textContent = '';
      status.style.display = 'none';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  storage.sync.get({
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
    nightModeEnd: 10,
  }, function(items) {
    setRadioValue('typeOfClock', items.typeOfClock);
    document.getElementsByName('fontFamily')[0].value = items.fontFamily;
    document.getElementsByName('fontWeight')[0].value = items.fontWeight;
    document.getElementsByName('fontSize')[0].value = items.fontSize;
    document.getElementsByName('nightModeColor')[0].value = items.nightModeColor;
    document.getElementsByName('dayModeColor')[0].value = items.dayModeColor;
    document.getElementsByName('opacity')[0].value = items.opacity;
    document.getElementsByName('interval')[0].value = items.interval;
    document.getElementsByName('size')[0].value = items.size;
    document.getElementsByName('showSeconds')[0].checked = items.showSeconds;
    document.getElementsByName('showMilliseconds')[0].checked = items.showMilliseconds;
    document.getElementsByName('showShadow')[0].checked = items.showShadow;
    document.getElementsByName('nightModeStart')[0].value = items.nightModeStart;
    document.getElementsByName('nightModeEnd')[0].value = items.nightModeEnd;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('button[type="reset"]').addEventListener('click', restore_options);
document.querySelector('button[type="submit"]').addEventListener('click', save_options);
