"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/@beenotung/tslib/async/defer.js
  var require_defer = __commonJS({
    "node_modules/@beenotung/tslib/async/defer.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.resolveDefer = exports.createDefer = void 0;
      function createDefer() {
        const res = {};
        res.promise = new Promise((resolve, reject) => {
          res.resolve = (a) => {
            resolve(a);
            return res.promise;
          };
          res.reject = (e) => {
            reject(e);
            return res.promise;
          };
        });
        return res;
      }
      exports.createDefer = createDefer;
      async function resolveDefer(defer, a, f) {
        if (a != void 0 && a != null) {
          defer.resolve(a);
        } else {
          defer.reject(await f());
        }
        return defer.promise;
      }
      exports.resolveDefer = resolveDefer;
    }
  });

  // node_modules/@beenotung/tslib/arraybuffer-to-buffer.js
  var require_arraybuffer_to_buffer = __commonJS({
    "node_modules/@beenotung/tslib/arraybuffer-to-buffer.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.arrayBufferToBuffer = void 0;
      var isArrayBufferSupported = () => new Buffer(new Uint8Array([1]).buffer)[0] === 1;
      function arrayBufferToBufferAsArgument(ab) {
        return new Buffer(ab);
      }
      function arrayBufferToBufferCycle(ab) {
        const buffer = new Buffer(ab.byteLength);
        const view = new Uint8Array(ab);
        for (let i = 0; i < buffer.length; ++i) {
          buffer[i] = view[i];
        }
        return buffer;
      }
      function arrayBufferToBuffer(arrayBuffer) {
        if (isArrayBufferSupported()) {
          return arrayBufferToBufferAsArgument(arrayBuffer);
        } else {
          return arrayBufferToBufferCycle(arrayBuffer);
        }
      }
      exports.arrayBufferToBuffer = arrayBufferToBuffer;
    }
  });

  // node_modules/@beenotung/tslib/blob.js
  var require_blob = __commonJS({
    "node_modules/@beenotung/tslib/blob.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.arrayBufferToString = exports.blobToString = exports.blobToText = exports.blobToBuffer = void 0;
      var arraybuffer_to_buffer_1 = require_arraybuffer_to_buffer();
      async function blobToBuffer(blob) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((0, arraybuffer_to_buffer_1.arrayBufferToBuffer)(reader.result));
          reader.onerror = (e) => reject(e);
          reader.readAsArrayBuffer(blob);
        });
      }
      exports.blobToBuffer = blobToBuffer;
      function blobToText(blob) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result === null) {
              return reject("unexpected null reader.result");
            }
            return resolve(reader.result);
          };
          reader.onerror = (e) => reject(e);
          reader.readAsText(blob);
        });
      }
      exports.blobToText = blobToText;
      function blobToString(blob) {
        return blobToText(blob).then((x) => typeof x === "string" ? x : arrayBufferToString(x));
      }
      exports.blobToString = blobToString;
      function arrayBufferToString(array, encode) {
        if (typeof array === "string") {
          return array;
        }
        return new TextDecoder(encode).decode(array);
      }
      exports.arrayBufferToString = arrayBufferToString;
    }
  });

  // node_modules/@beenotung/tslib/file.js
  var require_file = __commonJS({
    "node_modules/@beenotung/tslib/file.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.saveStringToFile = exports.saveBlobToFile = exports.selectAudio = exports.selectVideo = exports.selectImage = exports.selectFile = exports.downloadFile = exports.fileToArrayBuffer = exports.fileToArray = exports.fileToBinaryString = exports.filesToBase64Strings = exports.filesMap = exports.filesForEach = exports.fileToText = exports.fileToBase64String = void 0;
      var defer_1 = require_defer();
      var blob_1 = require_blob();
      function createAsyncFileReader() {
        const defer = (0, defer_1.createDefer)();
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result === null) {
            return defer.reject("unexpected null reader.result");
          }
          return defer.resolve(reader.result);
        };
        reader.onerror = defer.reject;
        return [defer, reader];
      }
      async function fileToBase64String(file) {
        const [defer, reader] = createAsyncFileReader();
        reader.readAsDataURL(file);
        return defer.promise.then(blob_1.arrayBufferToString);
      }
      exports.fileToBase64String = fileToBase64String;
      async function fileToText(file) {
        const [defer, reader] = createAsyncFileReader();
        reader.readAsText(file);
        return defer.promise.then();
      }
      exports.fileToText = fileToText;
      function filesForEach(files, f) {
        if (Array.isArray(files)) {
          files.forEach(f);
        } else {
          for (let i = 0; i < files.length; i++) {
            f(files.item(i), i, files);
          }
        }
      }
      exports.filesForEach = filesForEach;
      function filesMap(files, f) {
        const xs = new Array(files.length);
        filesForEach(files, (file, i, files2) => xs[i] = f(file, i, files2));
        return xs;
      }
      exports.filesMap = filesMap;
      async function filesToBase64Strings(files) {
        return Promise.all(filesMap(files, (file) => fileToBase64String(file)));
      }
      exports.filesToBase64Strings = filesToBase64Strings;
      async function fileToBinaryString(file) {
        const [defer, reader] = createAsyncFileReader();
        reader.readAsBinaryString(file);
        return defer.promise.then(blob_1.arrayBufferToString);
      }
      exports.fileToBinaryString = fileToBinaryString;
      async function fileToArray(file) {
        const s = await fileToBinaryString(file);
        const n = s.length;
        const res = new Array(n);
        for (let i = 0; i < n; i++) {
          res[i] = s.charCodeAt(i);
        }
        return res;
      }
      exports.fileToArray = fileToArray;
      async function fileToArrayBuffer(file) {
        const [defer, reader] = createAsyncFileReader();
        reader.readAsArrayBuffer(file);
        return defer.promise.then((x) => {
          if (typeof x === "string") {
            const xs = new ArrayBuffer(x.length);
            for (let i = 0, n = x.length; i < n; i++) {
              xs[i] = x[i];
            }
            return xs;
          } else {
            return x;
          }
        });
      }
      exports.fileToArrayBuffer = fileToArrayBuffer;
      async function downloadFile(url, filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0]) {
        const defer = (0, defer_1.createDefer)();
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function() {
          const a = document.createElement("a");
          a.href = window.URL.createObjectURL(xhr.response);
          a.download = filename;
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          defer.resolve(true);
        };
        xhr.onerror = (e) => defer.reject(e);
        xhr.open("GET", url);
        xhr.send();
        return defer.promise;
      }
      exports.downloadFile = downloadFile;
      function captureMode(capture) {
        if (capture === true) {
          return "camera";
        }
        if (capture === false) {
          return "album";
        }
        return "both";
      }
      function selectFile(options = {}) {
        return new Promise((resolve, reject) => {
          if (!options.capture) {
            delete options.capture;
          }
          const input = document.createElement("input");
          input.type = "file";
          input.style.display = "none";
          Object.keys(options).forEach((x) => input[x] = options[x]);
          document.body.appendChild(input);
          input.onchange = (_event) => {
            if (!input.files) {
              reject("user canceled");
              document.body.removeChild(input);
              return;
            }
            const nFile = input.files.length;
            if (nFile < 1) {
              reject("no files selected");
            } else {
              const files = new Array(nFile);
              for (let i = 0; i < nFile; i++) {
                files[i] = input.files.item(i);
              }
              resolve(files);
            }
            document.body.removeChild(input);
          };
          input.click();
        });
      }
      exports.selectFile = selectFile;
      function selectImage(options = {}) {
        options.accept = options.accept || "image/*";
        if (captureMode(options.capture) === "both" && !options.accept.includes("camera")) {
          options.accept += ";capture=camera";
        }
        return selectFile(options);
      }
      exports.selectImage = selectImage;
      function selectVideo(options = {}) {
        options.accept = options.accept || "video/mp4,video/x-m4v,video/*";
        if (captureMode(options.capture) === "both" && !options.accept.includes("camcorder")) {
          options.accept += ";capture=camcorder";
        }
        return selectFile(options);
      }
      exports.selectVideo = selectVideo;
      function selectAudio(options = {}) {
        options.accept = options.accept || "audio/*";
        if (captureMode(options.capture) === "both" && !options.accept.includes("microphone")) {
          options.accept += ";capture=microphone";
        }
        return selectFile(options);
      }
      exports.selectAudio = selectAudio;
      function saveBlobToFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        if (filename) {
          a.download = filename;
        }
        a.href = url;
        if (document.body) {
          a.style.display = "none";
          a.textContent = "Download file";
          document.body.appendChild(a);
        }
        a.click();
      }
      exports.saveBlobToFile = saveBlobToFile;
      function saveStringToFile(s, type = "text/plain", filename) {
        return saveBlobToFile(new Blob([s], { type }), filename);
      }
      exports.saveStringToFile = saveStringToFile;
    }
  });

  // node_modules/@beenotung/tslib/result.js
  var require_result = __commonJS({
    "node_modules/@beenotung/tslib/result.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.thenF = exports.then = exports.isPromise = void 0;
      var PromiseString = Promise.resolve().toString();
      function isPromise(x) {
        return String(x) === PromiseString;
      }
      exports.isPromise = isPromise;
      function then(x, f, onError) {
        if (isPromise(x)) {
          const res = x.then(f);
          if (onError) {
            res.catch(onError);
          }
          return res;
        }
        return f(x);
      }
      exports.then = then;
      function thenF(f, q, onError) {
        try {
          const x = f();
          return then(x, q, onError);
        } catch (e) {
          if (typeof onError === "function") {
            onError(e);
          }
          return Promise.reject(e);
        }
      }
      exports.thenF = thenF;
    }
  });

  // node_modules/@beenotung/tslib/size.js
  var require_size = __commonJS({
    "node_modules/@beenotung/tslib/size.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.parseByteSize = exports.byteUnits = exports.GB = exports.MB = exports.KB = void 0;
      exports.KB = 1024;
      exports.MB = 1024 * exports.KB;
      exports.GB = 1024 * exports.MB;
      exports.byteUnits = {
        B: 1,
        KB: exports.KB,
        MB: exports.MB,
        GB: exports.GB
      };
      function parseByteSize(sizeText, defaultUnit = "B") {
        const sizeNum = parseFloat(sizeText);
        const numText = sizeNum.toString();
        let unitText = sizeText.replace(numText, "").toUpperCase();
        if (unitText !== "B" && unitText.length === 1) {
          unitText += "B";
        }
        const unit = exports.byteUnits[unitText] || exports.byteUnits[defaultUnit] || 1;
        return sizeNum * unit;
      }
      exports.parseByteSize = parseByteSize;
    }
  });

  // node_modules/@beenotung/tslib/image.js
  var require_image = __commonJS({
    "node_modules/@beenotung/tslib/image.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.compressMobilePhoto = exports.toImage = exports.compressImageToBlob = exports.canvasToBlob = exports.compressImageToBase64 = exports.compressImage = exports.dataURItoFile = exports.dataURItoBlob = exports.dataURItoMimeType = exports.flipImage = exports.rotateImage = exports.transformCentered = exports.resizeImage = exports.resizeBase64WithRatio = exports.resizeWithRatio = exports.ResizeTypes = exports.getWidthHeightFromBase64 = exports.resizeBase64Image = exports.base64ToCanvas = exports.checkBase64ImagePrefix = exports.base64ToImage = exports.imageToBase64 = exports.imageToCanvas = void 0;
      var file_1 = require_file();
      var result_1 = require_result();
      var size_1 = require_size();
      function imageToCanvas(img, width, height) {
        const canvas2 = document.createElement("canvas");
        const ctx = canvas2.getContext("2d");
        if (ctx === null) {
          throw new Error("unsupported");
        }
        canvas2.width = width;
        canvas2.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        return canvas2;
      }
      exports.imageToCanvas = imageToCanvas;
      function imageToBase64(img, width, height) {
        return imageToCanvas(img, width, height).toDataURL();
      }
      exports.imageToBase64 = imageToBase64;
      async function base64ToImage(data) {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = (e) => reject(e);
          image.src = data;
        });
      }
      exports.base64ToImage = base64ToImage;
      function checkBase64ImagePrefix(s) {
        return typeof s === "string" && s.startsWith("/9j/") ? "data:image/jpeg;base64," + s : s;
      }
      exports.checkBase64ImagePrefix = checkBase64ImagePrefix;
      async function base64ToCanvas(data, width, height) {
        const image = await base64ToImage(data);
        let w;
        let h;
        if (width && height) {
          w = width;
          h = height;
        } else if (!width && !height) {
          w = image.naturalWidth;
          h = image.naturalHeight;
        } else if (width) {
          w = width;
          h = image.naturalHeight / image.naturalWidth * width;
        } else if (height) {
          w = image.naturalWidth / image.naturalHeight * height;
          h = height;
        } else {
          throw new Error("logic error, missing edge case:" + JSON.stringify({ width, height }));
        }
        return imageToCanvas(image, w, h);
      }
      exports.base64ToCanvas = base64ToCanvas;
      async function resizeBase64Image(data, targetWidth, targetHeight) {
        return (await base64ToCanvas(data, targetWidth, targetHeight)).toDataURL();
      }
      exports.resizeBase64Image = resizeBase64Image;
      async function getWidthHeightFromBase64(data) {
        const image = await base64ToImage(data);
        return {
          width: image.naturalWidth,
          height: image.naturalHeight
        };
      }
      exports.getWidthHeightFromBase64 = getWidthHeightFromBase64;
      exports.ResizeTypes = {
        /* with-in the given area, maybe smaller  */
        with_in: "with_in",
        /* at least as large as the given area, maybe larger */
        at_least: "at_least"
      };
      function resizeWithRatio(oriSize, targetSize, mode) {
        const widthRate = targetSize.width / oriSize.width;
        const heightRate = targetSize.height / oriSize.height;
        let rate;
        switch (mode) {
          case exports.ResizeTypes.with_in:
            rate = Math.min(widthRate, heightRate);
            break;
          case exports.ResizeTypes.at_least:
            rate = Math.max(widthRate, heightRate);
            break;
          default:
            throw new TypeError(`unsupported type: ${mode}`);
        }
        return {
          width: oriSize.width * rate,
          height: oriSize.height * rate
        };
      }
      exports.resizeWithRatio = resizeWithRatio;
      async function resizeBase64WithRatio(data, preferredSize, mode) {
        const image = await base64ToImage(data);
        const targetSize = resizeWithRatio({
          width: image.naturalWidth,
          height: image.naturalHeight
        }, preferredSize, mode);
        return imageToBase64(image, targetSize.width, targetSize.height);
      }
      exports.resizeBase64WithRatio = resizeBase64WithRatio;
      function getNewScale(image, maxWidth, maxHeight) {
        if (image.width <= maxWidth && image.height <= maxHeight) {
          return 1;
        }
        if (image.width > image.height) {
          return image.width / maxWidth;
        } else {
          return image.height / maxHeight;
        }
      }
      function resizeImage(image, maxWidth = image.width, maxHeight = image.height, mimeType, quality) {
        const scale = getNewScale(image, maxWidth, maxHeight);
        const scaledWidth = image.width / scale;
        const scaledHeight = image.height / scale;
        const canvas2 = document.createElement("canvas");
        canvas2.width = scaledWidth;
        canvas2.height = scaledHeight;
        const context = canvas2.getContext("2d");
        if (context === null) {
          throw new Error("not supported");
        }
        context.drawImage(image, 0, 0, scaledWidth, scaledHeight);
        if (mimeType) {
          return canvas2.toDataURL(mimeType, quality || 1);
        } else {
          return canvas2.toDataURL();
        }
      }
      exports.resizeImage = resizeImage;
      function transformCentered(image, flipXY, f) {
        const canvas2 = document.createElement("canvas");
        canvas2.width = flipXY ? image.height : image.width;
        canvas2.height = flipXY ? image.width : image.height;
        const ctx = canvas2.getContext("2d");
        if (ctx === null) {
          throw new Error("not supported");
        }
        ctx.translate(canvas2.width * 0.5, canvas2.height * 0.5);
        f(ctx);
        ctx.translate(-image.width * 0.5, -image.height * 0.5);
        ctx.drawImage(image, 0, 0);
        return canvas2;
      }
      exports.transformCentered = transformCentered;
      function rotateImage(image) {
        return transformCentered(image, true, (ctx) => ctx.rotate(0.5 * Math.PI));
      }
      exports.rotateImage = rotateImage;
      function flipImage(image) {
        return transformCentered(image, false, (ctx) => ctx.scale(-1, 1));
      }
      exports.flipImage = flipImage;
      function dataURItoMimeType(dataURI) {
        const idx = dataURI.indexOf(",");
        if (idx === -1) {
          throw new Error("data uri prefix not found");
        }
        const prefix = dataURI.substring(0, idx);
        const [mimeType] = prefix.replace(/^data:/, "").split(";");
        return mimeType;
      }
      exports.dataURItoMimeType = dataURItoMimeType;
      function dataURItoBlob(dataURI) {
        const [format, payload] = dataURI.split(",");
        const [mimeType] = format.replace(/^data:/, "").split(";");
        let byteString;
        if (dataURI.startsWith("data:")) {
          byteString = atob(payload);
        } else {
          byteString = unescape(payload);
        }
        const n = byteString.length;
        const buffer = new Uint8Array(n);
        for (let i = 0; i < n; i++) {
          buffer[i] = byteString.charCodeAt(i);
        }
        return new Blob([buffer], { type: mimeType });
      }
      exports.dataURItoBlob = dataURItoBlob;
      function dataURItoFile2(dataURI, originalFile) {
        const blob = dataURItoBlob(dataURI);
        let filename = removeExtname(originalFile?.name || "image");
        const ext = blob.type.split("/").pop();
        filename += "." + ext;
        return new File([blob], filename, {
          type: blob.type,
          lastModified: originalFile?.lastModified || Date.now()
        });
      }
      exports.dataURItoFile = dataURItoFile2;
      function removeExtname(filename) {
        return filename.replace(/\.(jpg|jpeg|png|gif|bmp|webp)$/i, "");
      }
      function compressImage(image, mimeType, quality = 0.8) {
        const canvas2 = document.createElement("canvas");
        canvas2.width = image.width;
        canvas2.height = image.height;
        const ctx = canvas2.getContext("2d");
        if (ctx === null) {
          throw new Error("not supported");
        }
        ctx.drawImage(image, 0, 0);
        if (mimeType) {
          return canvas2.toDataURL(mimeType, quality);
        }
        const png = canvas2.toDataURL("image/png", quality);
        const jpeg = canvas2.toDataURL("image/jpeg", quality);
        return jpeg.length < png.length ? jpeg : png;
      }
      exports.compressImage = compressImage;
      function populateCompressArgs(args) {
        const image = args.image;
        const canvas2 = args.canvas || document.createElement("canvas");
        const ctx = args.ctx || canvas2.getContext("2d") || (() => {
          throw new Error("not supported");
        })();
        let maximumSize = args.maximumSize;
        let quality = args.quality;
        if (!maximumSize && !quality) {
          maximumSize = 768 * size_1.KB;
          quality = 0.8;
        }
        return {
          image,
          canvas: canvas2,
          ctx,
          maximumSize,
          quality
        };
      }
      function compressImageToBase64(args) {
        const { image, canvas: canvas2, ctx, maximumSize, quality } = populateCompressArgs({
          ...args,
          maximumSize: args.maximumLength
        });
        canvas2.width = image.width;
        canvas2.height = image.height;
        ctx.drawImage(image, 0, 0);
        let mimeType;
        let dataURL;
        if (args.mimeType) {
          mimeType = args.mimeType;
          dataURL = canvas2.toDataURL(mimeType, quality);
        } else {
          const png = canvas2.toDataURL("image/png", quality);
          const jpeg = canvas2.toDataURL("image/jpeg", quality);
          if (jpeg < png) {
            mimeType = "image/jpeg";
            dataURL = jpeg;
          } else {
            mimeType = "image/png";
            dataURL = png;
          }
        }
        if (!maximumSize) {
          return dataURL;
        }
        for (; dataURL.length > maximumSize; ) {
          const ratio = Math.sqrt(maximumSize / dataURL.length);
          const new_width = Math.round(canvas2.width * ratio);
          const new_height = Math.round(canvas2.height * ratio);
          if (new_width === canvas2.width && new_height === canvas2.height) {
            break;
          }
          canvas2.width = new_width;
          canvas2.height = new_height;
          ctx.drawImage(image, 0, 0, new_width, new_height);
          dataURL = canvas2.toDataURL(mimeType, quality);
        }
        return dataURL;
      }
      exports.compressImageToBase64 = compressImageToBase64;
      function canvasToBlob(canvas2, mimeType, quality) {
        return new Promise((resolve, reject) => canvas2.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject("not supported");
          }
        }, mimeType, quality));
      }
      exports.canvasToBlob = canvasToBlob;
      async function compressImageToBlob(args) {
        const { image, canvas: canvas2, ctx, maximumSize, quality } = populateCompressArgs(args);
        canvas2.width = image.width;
        canvas2.height = image.height;
        ctx.drawImage(image, 0, 0);
        let mimeType;
        let blob;
        if (args.mimeType) {
          mimeType = args.mimeType;
          blob = await canvasToBlob(canvas2, mimeType, quality);
        } else {
          const [png, jpeg] = await Promise.all([
            canvasToBlob(canvas2, "image/png", quality),
            canvasToBlob(canvas2, "image/jpeg", quality)
          ]);
          if (jpeg.size < png.size) {
            mimeType = "image/jpeg";
            blob = jpeg;
          } else {
            mimeType = "image/png";
            blob = png;
          }
        }
        if (!maximumSize) {
          return blob;
        }
        for (; blob.size > maximumSize; ) {
          const ratio = Math.sqrt(maximumSize / blob.size);
          const new_width = Math.round(canvas2.width * ratio);
          const new_height = Math.round(canvas2.height * ratio);
          if (new_width === canvas2.width && new_height === canvas2.height) {
            break;
          }
          canvas2.width = new_width;
          canvas2.height = new_height;
          ctx.drawImage(image, 0, 0, new_width, new_height);
          blob = await canvasToBlob(canvas2, mimeType, quality);
        }
        return blob;
      }
      exports.compressImageToBlob = compressImageToBlob;
      function toImage(image) {
        if (typeof image === "string") {
          return base64ToImage(image);
        }
        if (image instanceof File) {
          return (0, file_1.fileToBase64String)(image).then((base64) => toImage(base64));
        }
        if (image instanceof HTMLImageElement) {
          return image;
        }
        console.error("unknown image type:", image);
        throw new TypeError("unknown image type");
      }
      exports.toImage = toImage;
      var DefaultMaximumMobilePhotoSize = 300 * size_1.KB;
      async function compressMobilePhoto(args) {
        const maximumLength = args.maximumSize || DefaultMaximumMobilePhotoSize;
        return (0, result_1.then)(toImage(args.image), (image) => compressImageToBase64({ image, maximumLength, quality: args.quality }));
      }
      exports.compressMobilePhoto = compressMobilePhoto;
    }
  });

  // src/main.ts
  var import_image = __toESM(require_image());
  var camera_button = document.querySelector(
    "#start-camera"
  );
  var video = document.querySelector("#video");
  var click_button = document.querySelector("#click-photo");
  var canvas = document.querySelector("#canvas");
  var uploadImageBtn = document.querySelector(
    "#uploadImageBtn"
  );
  var resultContainer = document.querySelector("#resultContainer");
  var uploadForm = document.querySelector("#uploadForm");
  var loadingIcon = document.querySelector("#loading");
  uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    let form = uploadForm;
    const formData = new FormData(form);
    await diagnosis(formData);
  });
  camera_button.addEventListener("click", async () => {
    let stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
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
    let file = (0, import_image.dataURItoFile)(imageDataUrl);
    let formData = new FormData();
    formData.set("file", file);
    await diagnosis(formData);
  });
  async function diagnosis(formData) {
    resultContainer.textContent = "";
    loadingIcon.innerHTML = '<i class="fas fa-sync fa-spin"></i>';
    const res = await fetch("/diagnosis", {
      method: "POST",
      body: formData
    });
    let json = await res.json();
    loadingIcon.innerHTML = "";
    if (json.error) {
      resultContainer.textContent = json.error;
      return;
    }
    let src = "result/" + json.filename;
    console.log(screen.width);
    if (src.endsWith(".mp4")) {
      let video2 = document.createElement("video");
      video2.controls = true;
      video2.loop = true;
      if (screen.width < 768) {
        video2.height = 240;
        video2.width = 320;
      } else {
        video2.height = 480;
        video2.width = 640;
      }
      video2.muted = true;
      video2.playsInline = true;
      video2.autoplay = true;
      video2.src = src;
      resultContainer.appendChild(video2);
    } else {
      let img = document.createElement("img");
      img.src = src;
      if (screen.width < 768) {
        img.height = 240;
        img.width = 320;
      } else {
        img.height = 480;
        img.width = 640;
      }
      resultContainer.appendChild(img);
    }
  }
})();
