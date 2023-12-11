const roadAudio = document.getElementById("audioFile");
const btnPlay = document.getElementById("btnPlay");
const btnVolume = document.getElementById("btnVolume");
const timeCurrent = document.getElementById("timeCurrent");
const timeDuration = document.getElementById("timeDuration");
const timeProgress = document.getElementById("timeProgress");

// audio load
roadAudio.addEventListener("loadeddata", function () {
  const durationTime = getTimeCodeFromNum(roadAudio.duration);
  timeDuration.innerText = durationTime;
});

// 재생, 일시정지
btnPlay.addEventListener("click", function () {
  if (roadAudio.paused) {
    // 정지상태
    roadAudio.play();
    //btnPlay.classList.remove("play");
    btnPlay.classList.add("pause");
    btnPlay.childNodes.innerText = "일시정지";

    setInterval(function () {
      timeProgress.value = (roadAudio.currentTime / roadAudio.duration) * 100;
      timeCurrent.textContent = getTimeCodeFromNum(roadAudio.currentTime);
      styleBarActive();
    }, 500);
  } else {
    roadAudio.pause();
    //btnPlay.classList.add("play");
    btnPlay.classList.remove("pause");
    btnPlay.childNodes.innerText = "재생";
  }
});

// 볼륨 on/off
btnVolume.addEventListener("click", function () {
  if (btnVolume.classList.contains("muted")) {
    // 음소거 상태
    roadAudio.volume = 1;
    btnVolume.classList.remove("muted");
  } else {
    roadAudio.volume = 0;
    btnVolume.classList.add("muted");
  }
});

// range bar click
timeProgress.addEventListener("input", function () {
  const timeToSeek = (roadAudio.duration * timeProgress.value) / 100;
  roadAudio.currentTime = timeToSeek;
  timeCurrent.textContent = getTimeCodeFromNum(timeToSeek);
  styleBarActive();
});

function styleBarActive() {
  timeProgress.style.background =
    "linear-gradient(to right, #AD2A4B 0%, #AD2A4B " +
    timeProgress.value +
    "%, #C8C8D7 " +
    timeProgress.value +
    "%, #C8C8D7 50%)";
}

/**
 *
 * @param {*} num : 파일 재생시간 - 초단위 (audio.duration)
 */
function getTimeCodeFromNum(num) {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;

  const hours = parseInt(minutes / 60);
  minutes -= hours * 60;

  let str = "";
  if (hours === 0) {
    str += minutes + ":";
    if (seconds < 10) {
      str += "0" + seconds;
    } else {
      str += seconds;
    }
    return str;
  }

  str += hours + ":" + minutes + ":";
  if (seconds < 10) {
    str += "0" + seconds;
  } else {
    str += seconds;
  }
  return str;
}
