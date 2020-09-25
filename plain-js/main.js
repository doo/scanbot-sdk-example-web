
const containerId = "scanbot-camera-container";
const licenseKey = "";

let scanbotSDK;
let documentScanner;

/** For a smoother experience, wait for everything else to be loaded before loading anything in the SDK */
window.onload = async function() {
	scanbotSDK = await ScanbotSDK.initialize({
        licenseKey: licenseKey,
        // engine: "lib/"
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
};
