import { canvasToBlob, dataURItoFile } from "@beenotung/tslib/image";
import { Buffer } from "buffer";
import { log } from "console";

let camera_button = document.querySelector(
  "#start-camera"
) as HTMLButtonElement;
let video = document.querySelector("#video") as HTMLVideoElement;
let click_button = document.querySelector("#click-photo") as HTMLButtonElement;
let canvas = document.querySelector("#canvas") as HTMLCanvasElement;
let uploadImageBtn = document.querySelector(
  "#uploadImageBtn"
) as HTMLButtonElement;
let resultContainer = document.querySelector("#resultContainer") as HTMLElement;
let uploadForm = document.querySelector("#uploadForm") as HTMLFormElement;

uploadForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  let form = uploadForm;

  const formData = new FormData(form);

  await diagnosis(formData);
});

camera_button.addEventListener("click", async () => {
  let stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  video.srcObject = stream;
});

click_button.addEventListener("click", () => {
  let context = canvas.getContext("2d");
  if (context == null) {
    return;
  }
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
});
uploadImageBtn.addEventListener("click", async () => {
  let imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);
  let file = dataURItoFile(imageDataUrl);
  let formData = new FormData();
  formData.set("file", file);

  await diagnosis(formData);
});

async function diagnosis(formData: FormData) {
  const res = await fetch("/diagnosis", {
    method: "POST",
    body: formData,
  });
  let json = await res.json();

  if (json.error) {
    resultContainer.textContent = json.error;
    return;
  }

  resultContainer.textContent = "";

  let src = "result/" + json.filename;

  if (src.endsWith(".mp4")) {
    let video = document.createElement("video");
    video.controls = true;
    video.loop = true;
    video.height = 240;
    video.width = 320;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.src = src;
    resultContainer.appendChild(video);
  } else {
    let img = document.createElement("img");
    img.src = src;
    img.height = 240;
    img.width = 320;
    resultContainer.appendChild(img);
  }
}

// async function main() {
//   let canvas = document.querySelector("canvas#painter") as HTMLCanvasElement;
// let context = canvas.getContext("2d");
//   let dataUrl = canvas.toDataURL("image/jpeg", 0.5);
//   let file = dataURItoFile(dataUrl);
//   let blob = await canvasToBlob(canvas, "image/jpeg", 0.5);
//   let file = new File([blob], "image.jpeg", {
//     type: "image/jpeg",
//     lastModified: Date.now(),
//   });
//   let formData = new FormData();
//   formData.set("image", file);
//   let res = await fetch("/detect", { method: "POST", body: formData });
// }
// main();
