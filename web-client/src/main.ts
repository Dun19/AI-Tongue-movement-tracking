import { canvasToBlob, dataURItoFile } from "@beenotung/tslib/image";

let camera_button = document.querySelector(
  "#start-camera"
) as HTMLButtonElement;
let video = document.querySelector("#video") as HTMLVideoElement;
let click_button = document.querySelector("#click-photo") as HTMLButtonElement;
let canvas = document.querySelector("#canvas") as HTMLCanvasElement;
let uploadImageBtn = document.querySelector(
  "#uploadImageBtn"
) as HTMLButtonElement;
let result = document.querySelector("#result") as HTMLDivElement;

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
  let imageDataUrl = canvas.toDataURL("image/jpeg", 0.5);
  let file = dataURItoFile(imageDataUrl);
  let formData = new FormData();
  formData.set("image", file);
  console.log(formData);
  let res = await fetch("/diagnosis", {
    method: "POST",
    body: formData,
  });
  let json = await res.json();
  console.log(json);
  if (!json) {
    result.textContent = "error";
  }
  result.textContent = json.result;
});
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
