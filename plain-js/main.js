
const containerId = "scanbot-camera-container";
const licenseKey = "";

let scanbotSDK;
let documentScanner;

// For a smoother experience, wait for everything else to be loaded before loading anything in the SDK
window.onload = async function() {

    document.getElementById("popup-close-button").onclick = function () {
        console.log("asfdag");
        document.getElementById("image-modal").classList.toggle("modal");
    };
	scanbotSDK = await ScanbotSDK.initialize({
        // Required parameter licenseKey
        licenseKey: licenseKey,
        // Optional: configure another source for the engine
        // engine: "lib/"
    });

    const config = {
    	containerId: containerId,
        onDocumentDetected: e => {
            console.log("Detected Document:", e);
            document.getElementById("document-image").src = e.cropped ? e.cropped : e.original;
            document.getElementById("image-modal").classList.toggle("modal");
        },
        onError: e => {
            console.log("Error:", e);
        }
    };

    documentScanner = await scanbotSDK.createDocumentScanner(config);
};
