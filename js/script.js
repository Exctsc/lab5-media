// ELEMENTS
let player = document.getElementById("player");
let scene = document.getElementById("scene");
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
let carRight = document.getElementById("carRight");
let carLeft = document.getElementById("carLeft");
let bus = document.getElementById("bus");
let signal = document.getElementById("signal");
let leaves = document.getElementById("leaves");
let progress = document.getElementById("progress");
let message = document.getElementById("message");
let fact = document.getElementById("fact");

let gooseSound = document.getElementById("gooseSound");
let chimeSound = document.getElementById("chimeSound");
let hornSound = document.getElementById("hornSound");
let cuckooSound = document.getElementById("cuckooSound");

// VARIABLES
// The soundscape has five parts. Each part starts at a time (in seconds).
let partStarts = [0, 14, 28, 46, 58];
let partNames = ["The Credit River", "Riverwood", "Mississauga Road", "The Crosswalk", "Erindale GO"];
let partText = [
  "Water running over the rocks, wind in the trees, and Canada geese heading out for the night.",
  "Walking up through Riverwood. Dry November leaves crunch with every step.",
  "Cars on Mississauga Road. A bus pulls in, the air brakes hiss, the doors chime, and it pulls away.",
  "The signal ticks while I wait. Then the cuckoo sound says it is safe to cross.",
  "The crossing bell rings and a GO train sounds its horn on the Milton line."
];
// the sky gets darker as the walk goes on
let skyColors = ["#3d3560", "#2c2a55", "#1d2246", "#151b3a", "#0b1228"];

let volume = 1.0;
let length = 80; // updated to the real length once the audio loads

// FUNCTIONS

// Works out which part (0 to 4) is playing at a given time
function getPart(time) {
  if (time >= partStarts[4]) {
    return 4;
  } else if (time >= partStarts[3]) {
    return 3;
  } else if (time >= partStarts[2]) {
    return 2;
  } else if (time >= partStarts[1]) {
    return 1;
  } else {
    return 0;
  }
}

// How far along we are between a start and end time (0 = start, 1 = end)
function between(time, start, end) {
  return (time - start) / (end - start);
}

// Turns seconds into m:ss
function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let secs = Math.floor(seconds) - minutes * 60;
  if (secs < 10) {
    secs = "0" + secs;
  }
  return minutes + ":" + secs;
}

// Runs every time the audio moves forward (timeupdate) and moves everything in the scene
function updateScene() {
  let time = player.currentTime;
  let part = getPart(time);

  // caption and sky colour
  document.getElementById("partNumber").innerHTML = "Part " + (part + 1) + " of 5";
  document.getElementById("partName").innerHTML = partNames[part];
  document.getElementById("partText").innerHTML = partText[part];
  sky.style.backgroundColor = skyColors[part];

  // more stars come out as it gets later
  stars.style.opacity = 0.2 + (time / length) * 0.8;

  // the moon travels across the sky in an arc over the whole track
  let p = time / length;
  moon.style.left = (52 + p * 38) + "%";
  moon.style.top = (6 + 60 * (p - 0.5) * (p - 0.5)) + "%";

  // ground: river at the start, road once we reach Mississauga Road
  if (time < 26) {
    river.style.opacity = 1;
    road.style.opacity = 0;
  } else {
    river.style.opacity = 0;
    road.style.opacity = 1;
  }

  moveGeese(time);
  showLeaves(time);
  moveCars(time);
  moveBus(time);
  updateSignal(time);
  moveTrain(time);
  updateCrossing(time);

  // progress bar and message
  progress.style.width = (time / length) * 100 + "%";
  updateMessage();
}

// Geese fly across while you hear them honking (5s to 14s)
function moveGeese(time) {
  if (time >= 5 && time <= 14) {
    geese.style.opacity = 1;
    geese.style.left = (-20 + between(time, 5, 14) * 125) + "%";
  } else {
    geese.style.opacity = 0;
  }
}

// Leaves fall during the footsteps on leaves (14s to 33s)
function showLeaves(time) {
  if (time >= 14 && time <= 33) {
    leaves.style.display = "block";
  } else {
    leaves.style.display = "none";
  }
}

// Cars drive by at the same times you hear them pass
function moveCars(time) {
  if (time >= 28 && time <= 34) {
    carRight.style.left = (-15 + between(time, 28, 34) * 130) + "%";
  } else if (time >= 49 && time <= 54.5) {
    carRight.style.left = (-15 + between(time, 49, 54.5) * 130) + "%";
  } else {
    carRight.style.left = "-20%";
  }

  if (time >= 31.5 && time <= 36) {
    carLeft.style.left = (110 - between(time, 31.5, 36) * 130) + "%";
  } else if (time >= 45.5 && time <= 50.5) {
    carLeft.style.left = (110 - between(time, 45.5, 50.5) * 130) + "%";
  } else {
    carLeft.style.left = "110%";
  }
}

// The bus pulls in, stops while the brakes and doors go, then leaves
function moveBus(time) {
  if (time >= 35 && time < 40) {
    bus.style.left = (-30 + between(time, 35, 40) * 60) + "%";
  } else if (time >= 40 && time < 44.5) {
    bus.style.left = "30%";
  } else if (time >= 44.5 && time <= 50.5) {
    bus.style.left = (30 + between(time, 44.5, 50.5) * 80) + "%";
  } else {
    bus.style.left = "-35%";
  }
}

// The walk signal turns on when you hear the cuckoo (51s to 58.5s)
// or while you are playing its sound effect by clicking it
function updateSignal(time) {
  if (time >= 51 && time <= 58.5) {
    signal.src = "images/signal-walk.svg";
  } else if (cuckooSound.paused == false) {
    signal.src = "images/signal-walk.svg";
  } else {
    signal.src = "images/signal-hand.svg";
  }
}

// The train crosses while you hear it rumble past (62s to 78s)
function moveTrain(time) {
  if (time >= 62 && time <= 78) {
    train.style.left = (-85 + between(time, 62, 78) * 190) + "%";
  } else {
    train.style.left = "-85%";
  }
}

// The crossing lights flash while the bell rings (59s to 74s)
function updateCrossing(time) {
  if (time >= 59 && time <= 74) {
    lightLeft.style.animation = "blink 1.1s infinite";
    lightRight.style.animation = "blink 1.1s infinite 0.55s";
  } else {
    lightLeft.style.animation = "none";
    lightRight.style.animation = "none";
  }
}

// Shows time, volume and speed under the scene
function updateMessage() {
  message.innerHTML = "time: " + formatTime(player.currentTime) + " / " + formatTime(length);
  message.innerHTML += " | volume: " + Math.round(player.volume * 100) + "%";
  message.innerHTML += " | speed: " + player.playbackRate + "x";
}

// Pauses or plays the falling leaves together with the audio
function setLeaves(state) {
  document.getElementById("leaf1").style.animationPlayState = state;
  document.getElementById("leaf2").style.animationPlayState = state;
  document.getElementById("leaf3").style.animationPlayState = state;
  document.getElementById("leaf4").style.animationPlayState = state;
  document.getElementById("leaf5").style.animationPlayState = state;
  river.style.animationPlayState = state;
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
  volume += 0.1;
  if (volume > 1.0) {
    volume = 1.0;
  }
  player.volume = volume;
}

function volumeDown() {
  volume -= 0.1;
  if (volume < 0.0) {
    volume = 0.0;
  }
  player.volume = volume;
}

function slowSpeed() {
  player.playbackRate = 0.5;
}

function normalSpeed() {
  player.playbackRate = 1;
}

function fastSpeed() {
  player.playbackRate = 1.5;
}

// jumps to the start of a part and plays from there
function jumpTo(part) {
  player.currentTime = partStarts[part];
  player.play();
}

function jumpToPart1() {
  jumpTo(0);
}

function jumpToPart2() {
  jumpTo(1);
}

function jumpToPart3() {
  jumpTo(2);
}

function jumpToPart4() {
  jumpTo(3);
}

function jumpToPart5() {
  jumpTo(4);
}

// MEDIA EVENTS

// the scene is in colour while playing and goes grey when paused
function playerStarted() {
  scene.style.filter = "none";
  setLeaves("running");
}

function playerPaused() {
  scene.style.filter = "grayscale(60%) brightness(0.75)";
  setLeaves("paused");
  if (player.currentTime > 0 && player.ended == false) {
    fact.innerHTML = "Paused at " + formatTime(player.currentTime) + ".";
  }
}

function playerEnded() {
  fact.innerHTML = "That's the walk home. Press play to go again.";
}

// the moon gets dimmer when the volume goes down
function volumeChanged() {
  volume = player.volume;
  moon.style.opacity = 0.3 + player.volume * 0.7;
  updateMessage();
}

function audioLoaded() {
  length = player.duration;
  updateMessage();
}

// CLICKING THINGS IN THE SCENE (each one plays its own sound effect)

function clickGeese() {
  gooseSound.currentTime = 0;
  gooseSound.play();
  fact.innerHTML = "Honk! Canada geese hang around the Credit River almost all year.";
}

function clickBus() {
  chimeSound.currentTime = 0;
  chimeSound.play();
  fact.innerHTML = "Ding ding. The bus up Mississauga Road is how I get to UTM.";
}

function clickTrain() {
  hornSound.currentTime = 0;
  hornSound.play();
  fact.innerHTML = "Two long, one short, one long: the horn pattern trains use at a crossing.";
}

function clickSignal() {
  cuckooSound.currentTime = 0;
  cuckooSound.play();
  fact.innerHTML = "In Ontario the walk signal goes cuckoo or chirp depending on which way you cross.";
}

function clickMoon() {
  if (player.paused) {
    player.play();
  } else {
    player.pause();
  }
}

// the walk signal shows "walk" while its sound effect is playing
function cuckooStarted() {
  signal.src = "images/signal-walk.svg";
}

function cuckooEnded() {
  updateSignal(player.currentTime);
}

// MOUSE: trees and skyline move a little with the mouse (parallax)
function mouseMoved(e) {
  let x = e.clientX / window.innerWidth - 0.5;
  trees.style.left = (-5 - x * 6) + "%";
  skyline.style.left = (0 - x * 2) + "%";
}

// EVENT LISTENERS

document.getElementById("playBtn").addEventListener("click", playAudio);
document.getElementById("pauseBtn").addEventListener("click", pauseAudio);
document.getElementById("stopBtn").addEventListener("click", stopAudio);
document.getElementById("volUpBtn").addEventListener("click", volumeUp);
document.getElementById("volDownBtn").addEventListener("click", volumeDown);
document.getElementById("slowBtn").addEventListener("click", slowSpeed);
document.getElementById("normalBtn").addEventListener("click", normalSpeed);
document.getElementById("fastBtn").addEventListener("click", fastSpeed);

document.getElementById("part1Btn").addEventListener("click", jumpToPart1);
document.getElementById("part2Btn").addEventListener("click", jumpToPart2);
document.getElementById("part3Btn").addEventListener("click", jumpToPart3);
document.getElementById("part4Btn").addEventListener("click", jumpToPart4);
document.getElementById("part5Btn").addEventListener("click", jumpToPart5);

player.addEventListener("timeupdate", updateScene);
player.addEventListener("play", playerStarted);
player.addEventListener("pause", playerPaused);
player.addEventListener("ended", playerEnded);
player.addEventListener("volumechange", volumeChanged);
player.addEventListener("ratechange", updateMessage);
player.addEventListener("loadedmetadata", audioLoaded);

geese.addEventListener("click", clickGeese);
bus.addEventListener("click", clickBus);
train.addEventListener("click", clickTrain);
signal.addEventListener("click", clickSignal);
moon.addEventListener("click", clickMoon);
cuckooSound.addEventListener("play", cuckooStarted);
cuckooSound.addEventListener("ended", cuckooEnded);

scene.addEventListener("mousemove", mouseMoved);

// start with the leaves paused until the audio plays
setLeaves("paused");
