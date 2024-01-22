const sectors = [
  { color: '#596056', label: 'Polluter', description: 'You lose all your points!', class:'sector'},
  { color: '#DCE59D', label: 'Lucky', description: 'You gain 10 points!'},
  { color: '#893836', label: 'Thief', description: 'Steal all the points from a player of your choice!'},
  { color: '#A5C49C', label: 'Lazy', description: 'You pass your next turn!'},
  { color: '#596056', label: 'Generous', description: 'All players share your points!'},
  { color: '#DCE59D', label: 'Trader', description: 'Double your points on your next turn!'},
  { color: '#893836', label: 'Traveller', description: 'Place yourself at the start of the second area!'},
  { color: '#A5C49C', label: 'Party', description: 'All players give you 2 points!'}
]
console.log(sectors);

const rand = (m, M) => Math.random() * (M - m) + m
const tot = sectors.length
const spinEl = document.querySelector('#spin')
const ctx = document.querySelector('#wheel').getContext('2d')
const dia = ctx.canvas.width
const rad = dia / 2
const PI = Math.PI
const TAU = 2 * PI
const arc = TAU / sectors.length

const friction = 0.991
let angVel = 0 // Angular velocity
let ang = 0 // Angle in radians

const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot

function drawSector(sector, i) {
  const ang = arc * i
  ctx.save()
  // COLOR
  ctx.beginPath()
  ctx.fillStyle = sector.color
  ctx.moveTo(rad, rad)
  ctx.arc(rad, rad, rad, ang, ang + arc)
  ctx.lineTo(rad, rad)
  ctx.fill()
  // TEXT
  ctx.translate(rad, rad)
  ctx.rotate(ang + arc / 2)
  ctx.textAlign = 'right'
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 15px math'
ctx.fillText(sector.label.toUpperCase(), rad - 10, 10)
  //
  ctx.restore()
}

function rotate() {
  const sector = sectors[getIndex()];
  ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
  spinEl.textContent = !angVel ? 'SPIN' : sector.label;
  spinEl.style.background = sector.color;

  if (!angVel) {
    const resultElement = document.getElementById('result');
    resultElement.textContent = sector.description;
    resultElement.style.color = '#596056';
    isWheelSpinning = false;
  }
}

document.addEventListener('touchend', () => {
  if (!isWheelSpinning) {
    angVel = rand(0.2, 0.3);
    isWheelSpinning = true;
  }
});


function frame() {
  if (!angVel) return
  angVel *= friction
  if (angVel < 0.002) angVel = 0
  ang += angVel
  ang %= TAU
  rotate()
}

function engine() {
  frame()
  requestAnimationFrame(engine)
}

function init() {
  sectors.forEach(drawSector)
  rotate()
  engine()
  spinEl.addEventListener('click', () => {
    if (!angVel) angVel = rand(0.2, 0.3)
  })

  let touchStartAngle = 0;
  let isWheelSpinning = false;

  document.addEventListener('touchstart', (e) => {
    if (!isWheelSpinning) {
      touchStartAngle = ang;
    }
  });

  document.addEventListener('touchmove', (e) => {
    e.preventDefault();

    if (!isWheelSpinning) {
      const touchMoveAngle = Math.atan2(
        e.touches[0].pageY - rad,
        e.touches[0].pageX - rad
      );
      const angleDiff = touchMoveAngle - touchStartAngle;
    
      ang = touchStartAngle + angleDiff;
      rotate();
    }
  }, { passive: false });

  document.addEventListener('touchend', () => {
    if (!isWheelSpinning) {
      angVel = rand(0.2, 0.3);
      isWheelSpinning = true;
    }
  });
}

init()
