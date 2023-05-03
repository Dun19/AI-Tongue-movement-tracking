let camera_button = document.querySelector("#start-camera");
let video = document.querySelector("#video");
let click_button = document.querySelector("#click-photo");
let canvas = document.querySelector("#canvas");
let uploadImageBtn = document.querySelector("#uploadImageBtn");

camera_button.addEventListener("click", async () => {
  let stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  video.srcObject = stream;
});

click_button.addEventListener("click", () => {
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  let imageDataUrl = canvas.toDataURL("image/jpeg");
  console.log(imageDataUrl);

  uploadImageBtn.addEventListener("submit", async () => {
    fetch("/tongueAI", {
      method: "POST",
      headers: { "Content-Type": "application/form" },
      body: JSON.stringify(imageDataUrl),
    });
  });
});
