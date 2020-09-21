
const containerId = "scanbot-camera-container";
const licenseKey =
	"HFShPXMA9HVCFTe7rSDyB2BNGYympq" +
	"j/Rd7fUkiSGNiUT1mfXnvNwP00AqjO" +
	"CNQg6XXxr+GVzyIXME1txuN/5wqg6u" +
	"4B50PPM9P9K5g2VRpAJMIpd53lCXF5" +
	"slOHXCv04c1TX8Nya965nD1pASkPB5" +
	"UMexC18OOfuSlmvihCxBcP5i2h5NK8" +
	"HVxIdFfYvccFVUc2AEIcUsyrx9Dif/" +
	"sPFAdFbZt20auIXng5sIg5JMJlsm70" +
	"yy7UnsTtz5NDjes9j1w8iyfui2P/0r" +
	"tYq7MImYOUW/T39pv550y1Xa4WqRg2" +
	"9BeL1YdbGRgaRhqOIorY+PkDBawfGw" +
	"kZgRU1lbfSwg==\nU2NhbmJvdFNESw" +
	"psb2NhbGhvc3QKMTYwOTQ1OTE5OQox" +
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
