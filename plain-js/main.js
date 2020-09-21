
const containerId = "scanbot-camera-container";
const licenseKey =
    "Fb+wAM65FKYR9rCXZ6Ts9PSUK9YGR0" +
    "/XLT1Tj4fUrylAnQHfiRFTD3lYQ9ZH" +
    "5tdZm42A3kg5FYUoEBi3hMeHBC/YZT" +
    "vbS7eg9t7j95yjZHHImgXjNc8X5kse" +
    "I9z4LhIspE5+aSHNh6OShY48ToY1oU" +
    "/WWdIn5gWZo19GahCmifVLsC1d81Tj" +
    "XlAj/6F3llOK+trHpYIHtik3gEORyu" +
    "2TY+KtjcZxW3c+xhsmvdVD0V6bhwua" +
    "VnXCXpTLZ1M0DOMh7pfDaZ4pfEnpR8" +
    "62mamP7t5AcofW4np3SxnOe96H3hRB" +
    "Me8VJgc+W6zr9RaYEFzVtjjW6Vn0eI" +
    "BL/G2CmMMrYQ==\nU2NhbmJvdFNESw" +
    "psb2NhbGhvc3R8c2NhbmJvdHNkay13" +
    "YXNtLWRlYnVnaG9zdC5zMy1ldS13ZX" +
    "N0LTEuYW1hem9uYXdzLmNvbXxzY2Fu" +
    "Ym90c2RrLXdlYnNkay1kZW1vLnMzLW" +
    "V1LXdlc3QtMS5hbWF6b25hd3MuY29t" +
    "fHdlYnNkay1kZW1vLWludGVybmFsLn" +
    "NjYW5ib3QuaW8KMTYwOTQ1OTE5OQox" +
    "MDQ4NTc1Cjg=\n";

let scanbotSDK;
let documentScanner;

/** For a smoother experience, wait for everything else to be loaded before loading anything in the SDK */
window.onload = async function() {
	scanbotSDK = await ScanbotSDK.initialize({
        licenseKey: licenseKey,
        // engine: "http://localhost:8000/lib/"
        engine: "lib/"
        // engine: "https://scanbotsdk-wasm-cors.s3-eu-west-1.amazonaws.com/"
    });

    const config = {
    	containerId: containerId,
        onDocumentDetected: e => {
            console.log("Detected Document:", e);
        },
        onError: e => {
            console.log("Error:", e);
        }
    };

    documentScanner = await scanbotSDK.createDocumentScanner(config);

    await documentScanner.startDetection();
};
