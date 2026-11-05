let player = document.getElementById("player");
let playBtn = document.getElementById("playBtn");
let pauseBtn = document.getElementById("pauseBtn");
let stopBtn = document.getElementById("stopBtn");
let message = document.getElementById("message");
let moon = document.getElementById("moon");

playBtn.addEventListener("click", playAudio);
pauseBtn.addEventListener("click", pauseAudio);
stopBtn.addEventListener("click", stopAudio);

player.addEventListener("play", playerStarted);
player.addEventListener("pause", playerPaused);
player.addEventListener("timeupdate", playerProgressed);

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

function playerStarted() {
  moon.style.backgroundColor = "#fff8dc";
}

function playerPaused() {
  message.innerHTML = "Paused";
  moon.style.backgroundColor = "#f1e9c9";
}

// TODO: move the moon across the sky as the track plays
function playerProgressed() {
  let minutes = Math.floor(player.currentTime / 60);
  let seconds = Math.floor(player.currentTime) - minutes * 60;
  message.innerHTML = "Playing at " + minutes + ":" + seconds;
}
