if ("serviceWorker" in navigator) {
  // Register the service worker for installability and offline support.
  navigator.serviceWorker.register("/serviceWorker.js");
}

const intro = document.querySelector("#intro");
const main = document.querySelector("#main");
const video = document.querySelector("#main video");
const startButton = document.querySelector("#start");
const errorSpan = document.querySelector("#error");
const footer = document.querySelector("footer");

startButton.onclick = start;

// If user has granted the permission before, start immediately, otherwise
// show intro and wait until they click the button.
if (localStorage.granted) {
  start();
} else {
  intro.hidden = false;
}

/**
 * Request camera and show main view if successful, intro otherwise.
 */
async function start() {
  startButton.disabled = true;

  // If the request is still pending after a while, this means the user is
  // being shown a permission popup. If so, show the intro in case it's hidden
  // This can only happen if the user has granted the permission previously but
  // retracted it later.
  const showIntroTimeout = setTimeout(() => {
    intro.hidden = false;
  }, 1000);

  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
      },
      audio: false,
    });
  } catch (error) {
    // Camera access failed, display the error and bail out.
    delete localStorage.granted;
    errorSpan.textContent = error;
    intro.hidden = false;
    return;
  } finally {
    // Failed or not, clear the timeout and re-enable the button.
    clearTimeout(showIntroTimeout);
    startButton.disabled = false;
  }

  // Camera access successful, let's go.
  localStorage.granted = 1;
  video.srcObject = stream;
  video.play();
  intro.hidden = true;
  main.hidden = false;
}

// The following code makes the flip checkbox work.
const flipCheckbox = document.querySelector("#flip");

if ("flip" in localStorage) {
  video.style.transform = "scaleX(-1)";
  flipCheckbox.checked = true;
}

flipCheckbox.onchange = () => {
  if (flipCheckbox.checked) {
    video.style.transform = "scaleX(-1)";
    localStorage.flip = 1;
  } else {
    video.style.removeProperty("transform");
    delete localStorage.flip;
  }
};
