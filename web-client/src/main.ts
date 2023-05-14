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
  console.log(json.data);
  let img64 = json.data.data.toString("base64");
  console.log(img64);
  resultImg.src = "data:image/jpeg;base64," + img64;
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

  //@ts-ignore
  let json = await res.json();
  console.log(json);
  //@ts-ignore
  if (json.mimetype == "image") {
    //@ts-ignore

    console.log("/result/" + json.data);

    resultImg.src = "data:image/jpeg;base64," + btoa(json.data);
  }

  // if (!res) {
  //   result.textContent = "error";
  // }
  // result.textContent = "1";
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
