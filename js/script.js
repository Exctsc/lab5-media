// ELEMENTS
let player = document.getElementById("player");
let scene = document.getElementById("scene");
let message = document.getElementById("message");
let fact = document.getElementById("fact");

let sky = document.getElementById("sky");
let stars = document.getElementById("stars");
let moon = document.getElementById("moon");
let skyline = document.getElementById("skyline");
let geese = document.getElementById("geese");
let trees = document.getElementById("trees");
let train = document.getElementById("train");
let lightLeft = document.getElementById("lightLeft");
let lightRight = document.getElementById("lightRight");
let road = document.getElementById("road");
let river = document.getElementById("river");
let car = document.getElementById("car");
let bus = document.getElementById("bus");
let signal = document.getElementById("signal");
let leaf1 = document.getElementById("leaf1");
let leaf2 = document.getElementById("leaf2");
let leaf3 = document.getElementById("leaf3");

let gooseSound = document.getElementById("gooseSound");
let chimeSound = document.getElementById("chimeSound");
let hornSound = document.getElementById("hornSound");
let cuckooSound = document.getElementById("cuckooSound");

// VARIABLES
let partNames = ["The Credit River", "Riverwood", "Mississauga Road", "The Crosswalk", "Erindale GO"];
let partText = [
  "Water over the rocks, wind in the trees, and Canada geese flying over.",
  "Walking up through Riverwood. Dry leaves crunch with every step.",
  "Cars go by. A bus pulls in, the brakes hiss, the doors chime, and it leaves.",
  "The signal ticks while I wait, then the walk sound says I can cross.",
  "The crossing bell rings and a GO train blows its horn."
];
let skyColors = ["#3d3560", "#2c2a55", "#1d2246", "#151b3a", "#0b1228"];

let volumeLevel = 10;

// FUNCTIONS

// which part is playing
function getPart(time) {
  if (time >= 58) {
    return 4;
  } else if (time >= 46) {
    return 3;
  } else if (time >= 28) {
    return 2;
  } else if (time >= 14) {
    return 1;
  } else {
    return 0;
  }
}

function between(time, start, end) {
  return (time - start) / (end - start);
}

function updateScene() {
  let time = player.currentTime;
  let part = getPart(time);

  document.getElementById("partName").innerHTML = "Part " + (part + 1) + ": " + partNames[part];
  document.getElementById("partText").innerHTML = partText[part];
  sky.style.backgroundColor = skyColors[part];

  stars.style.opacity = 0.2 + (time / player.duration) * 0.8;

  // moon
  let p = time / player.duration;
  moon.style.left = (470 + p * 360) + "px";
  moon.style.top = (20 + 240 * (p - 0.5) * (p - 0.5)) + "px";

  // river or road
  if (time < 26) {
    river.style.opacity = 1;
    road.style.opacity = 0;
  } else {
    river.style.opacity = 0;
    road.style.opacity = 1;
  }

  moveGeese(time);
  moveLeaves(time);
  moveCar(time);
  moveBus(time);
  updateSignal(time);
  moveTrain(time);
  updateCrossing(time);
  updateMessage();
}

// geese
function moveGeese(time) {
  if (time >= 5 && time <= 14) {
    geese.style.opacity = 1;
    geese.style.left = (-200 + between(time, 5, 14) * 1200) + "px";
  } else {
    geese.style.opacity = 0;
  }
}

// leaves
function moveLeaves(time) {
  if (time >= 14 && time <= 33) {
    leaf1.style.display = "block";
    leaf2.style.display = "block";
    leaf3.style.display = "block";
    leaf1.style.top = (-50 + ((time - 14) % 5) * 110) + "px";
    leaf2.style.top = (-50 + ((time - 12) % 5) * 110) + "px";
    leaf3.style.top = (-50 + ((time - 10.5) % 5) * 110) + "px";
  } else {
    leaf1.style.display = "none";
    leaf2.style.display = "none";
    leaf3.style.display = "none";
  }
}

// car
function moveCar(time) {
  if (time >= 28 && time <= 34) {
    car.style.left = (-150 + between(time, 28, 34) * 1150) + "px";
  } else if (time >= 49 && time <= 54.5) {
    car.style.left = (-150 + between(time, 49, 54.5) * 1150) + "px";
  } else {
    car.style.left = "-150px";
  }
}

// bus
function moveBus(time) {
  if (time >= 35 && time < 40) {
    bus.style.left = (-300 + between(time, 35, 40) * 550) + "px";
  } else if (time >= 40 && time < 44.5) {
    bus.style.left = "250px";
  } else if (time >= 44.5 && time <= 50.5) {
    bus.style.left = (250 + between(time, 44.5, 50.5) * 750) + "px";
  } else {
    bus.style.left = "-300px";
  }
}

// walk signal
function updateSignal(time) {
  if (time >= 51 && time <= 58.5) {
    signal.src = "images/signal-walk.svg";
  } else if (cuckooSound.paused == false) {
    signal.src = "images/signal-walk.svg";
  } else {
    signal.src = "images/signal-hand.svg";
  }
}

// train
function moveTrain(time) {
  if (time >= 62 && time <= 78) {
    train.style.left = (-760 + between(time, 62, 78) * 1760) + "px";
  } else {
    train.style.left = "-760px";
  }
}

// crossing lights
function updateCrossing(time) {
  if (time >= 59 && time <= 74) {
    if (Math.floor(time) % 2 == 0) {
      lightLeft.style.backgroundColor = "red";
      lightRight.style.backgroundColor = "#3a1515";
    } else {
      lightLeft.style.backgroundColor = "#3a1515";
      lightRight.style.backgroundColor = "red";
    }
  } else {
    lightLeft.style.backgroundColor = "#3a1515";
    lightRight.style.backgroundColor = "#3a1515";
  }
}

function updateMessage() {
  let minutes = Math.floor(player.currentTime / 60);
  let seconds = Math.floor(player.currentTime) - minutes * 60;
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  message.innerHTML = "time: " + minutes + ":" + seconds + " | volume: " + volumeLevel * 10 + "%";
}

// MEDIA CONTROLS

function playAudio() {
  player.play();
}

function pauseAudio() {
  player.pause();
}

function stopAudio() {
  player.currentTime = 0;
  player.pause();
}

function volumeUp() {
  volumeLevel += 1;
  if (volumeLevel > 10) {
    volumeLevel = 10;
  }
  player.volume = volumeLevel / 10;
}

function volumeDown() {
  volumeLevel -= 1;
  if (volumeLevel < 0) {
    volumeLevel = 0;
  }
  player.volume = volumeLevel / 10;
}

function slowSpeed() {
  player.playbackRate = 0.5;
}

function normalSpeed() {
  player.playbackRate = 1;
}

// MEDIA EVENTS

function playerStarted() {
  scene.style.opacity = 1;
}

function playerPaused() {
  scene.style.opacity = 0.6;
}

function playerEnded() {
  fact.innerHTML = "That's the walk home. Press play to go again.";
}

function volumeChanged() {
  moon.style.opacity = 0.3 + player.volume * 0.7;
  updateMessage();
}

// CLICKING THINGS

function clickGeese() {
  gooseSound.currentTime = 0;
  gooseSound.play();
  fact.innerHTML = "Honk! Canada geese live along the Credit River almost all year.";
}

function clickBus() {
  chimeSound.currentTime = 0;
  chimeSound.play();
  fact.innerHTML = "Ding ding. The bus up Mississauga Road is how I get to UTM.";
}

function clickTrain() {
  hornSound.currentTime = 0;
  hornSound.play();
  fact.innerHTML = "Long, long, short, long: the horn pattern trains use at a crossing.";
}

function clickSignal() {
  cuckooSound.currentTime = 0;
  cuckooSound.play();
  fact.innerHTML = "In Ontario the walk signal makes a cuckoo or chirp sound.";
}

function clickMoon() {
  if (player.paused) {
    player.play();
  } else {
    player.pause();
  }
}

function cuckooStarted() {
  signal.src = "images/signal-walk.svg";
}

function cuckooEnded() {
  updateSignal(player.currentTime);
}

// parallax
function mouseMoved(e) {
  trees.style.left = (-30 - e.clientX / 30) + "px";
  skyline.style.left = (0 - e.clientX / 80) + "px";
}

// EVENT LISTENERS

document.getElementById("playBtn").addEventListener("click", playAudio);
document.getElementById("pauseBtn").addEventListener("click", pauseAudio);
document.getElementById("stopBtn").addEventListener("click", stopAudio);
document.getElementById("volUpBtn").addEventListener("click", volumeUp);
document.getElementById("volDownBtn").addEventListener("click", volumeDown);
document.getElementById("slowBtn").addEventListener("click", slowSpeed);
document.getElementById("normalBtn").addEventListener("click", normalSpeed);

player.addEventListener("timeupdate", updateScene);
player.addEventListener("play", playerStarted);
player.addEventListener("pause", playerPaused);
player.addEventListener("ended", playerEnded);
player.addEventListener("volumechange", volumeChanged);

geese.addEventListener("click", clickGeese);
bus.addEventListener("click", clickBus);
train.addEventListener("click", clickTrain);
signal.addEventListener("click", clickSignal);
moon.addEventListener("click", clickMoon);
cuckooSound.addEventListener("play", cuckooStarted);
cuckooSound.addEventListener("ended", cuckooEnded);

scene.addEventListener("mousemove", mouseMoved);
