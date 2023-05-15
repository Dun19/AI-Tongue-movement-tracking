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
let resultImg = document.querySelector("#resultImg") as HTMLImageElement;
let resultVideo = document.querySelector("#resultVideo") as HTMLVideoElement;
let uploadForm = document.querySelector("#uploadForm") as HTMLFormElement;

uploadForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  let form = uploadForm;

  const formData = new FormData(form);

  const res = await fetch("/diagnosis", {
    method: "POST",
    body: formData,
  });
  let json = await res.json();

  if (json.mimetype == "image") {
    const url = `data:image/jpeg;base64,${Buffer.from(json.data).toString(
      "base64"
    )}`;
    resultImg.height = 240;
    resultImg.height = 320;
    console.log(1);
    resultImg.innerHTML = `<img src=${url}  alt="" />`;
    console.log(2);
  }
  if (json.mimetype == "video") {
    const url = `data:video/mp4;base64,${Buffer.from(json.data).toString(
      "base64"
    )}`;

    // let uint8Array = new Uint8Array(json.data);
    // let arrayBuffer = uint8Array.buffer;
    // let blob = new Blob([arrayBuffer]);
    // let url = URL.createObjectURL(blob);
    // // console.log(videoSrc);

    resultVideo.innerHTML = `
    <video width="320" height="240" src=${url} controls>
    </video>
    `;
    // console.log(1);
    // resultVideo.load();
    // console.log(2);
    // // resultVideo.play();
    // console.log(3);
  }
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

  let res = await fetch("/diagnosis", {
    method: "POST",
    body: formData,
  });

  let json = await res.json();

  if (json.mimetype == "image") {
    const url = `data:image/jpeg;base64,${Buffer.from(json.data).toString(
      "base64"
    )}`;
    resultImg.height = 240;
    resultImg.height = 320;
    resultImg.innerHTML = `<img src=${url}  alt="" />`;
  }
  if (json.mimetype == "video") {
    resultVideo.src = `data:video/avi;base64,${Buffer.from(json.data).toString(
      "base64"
    )}`;
  }
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
