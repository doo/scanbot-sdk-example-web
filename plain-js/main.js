const results = [];
let scanbotSDK;
let croppingViewController, documentDetailsController, documentListController,
  documentScannerController, barcodeScannerController,
  mrzScannerController, textDataScannerController;

window.onresize = () => {
  this.resizeContent();
};

window.onload = async () => {
  croppingViewController = new CroppingViewController(results);
  documentDetailsController = new DocumentDetailsController(results, croppingViewController);
  documentListController = new DocumentListController(results);
  documentScannerController = new DocumentScannerController(results, documentListController);
  barcodeScannerController = new BarcodeScannerController();
  mrzScannerController = new MrzScannerController();
  textDataScannerController = new TextPatternScannerController();

  this.resizeContent();

  Utils.getElementById("pick-document-button").onclick = (e) => {
    const picker = Utils.getElementByClassName("file-picker");
    picker.click();

    picker.onchange = (e) => {
      e.preventDefault();
      let reader = new FileReader();
      let file = e.target.files[0];
      reader.readAsArrayBuffer(file);

      reader.onload = async (e) => {
        const result = await scanbotSDK.detectDocument(reader.result);
        
        if (result.status.startsWith('OK')) {
          const cropped = await scanbotSDK.imageCrop(reader.result, result.pointsNormalized);
          result.originalImage = reader.result;
          result.croppedImage = cropped;

          results.push(result);
          await documentListController.show();
        } else {
          await Utils.alert("Detection failed");
        }
      };

      e.target.value = null;
    };
  };

  Utils.getElementById("pick-barcode-button").onclick = (e) => {
    const picker = Utils.getElementByClassName("file-picker");
    picker.click();

    picker.onchange = (e) => {
      e.preventDefault();
      let reader = new FileReader();
      let file = e.target.files[0];
      reader.readAsDataURL(file);

      reader.onload = async (e) => {
        const result = await scanbotSDK.detectBarcodes(reader.result);
        if (result.barcodes && result.barcodes.length > 0) {
          const detectedBarcodes = result.barcodes.map((barcode) => barcode.text);
          await Utils.alert("Detection successful: " + detectedBarcodes.join(", "));
        } else {
          await Utils.alert("Detection failed");
        }

        console.log("barcode detection result", result);
      };
    };
  };

  Utils.getElementByClassName("license-info-button").onclick = async (e) => {
    const info = await scanbotSDK.getLicenseInfo();
    await Utils.alert(JSON.stringify(info));
  };

  const backButtons = document.getElementsByClassName("back-button");

  for (let i = 0; i < backButtons.length; i++) {
    const button = backButtons[i];
    button.onclick = async (e) => {
      const controller =
        e.target.parentElement.parentElement.parentElement.className;

      if (controller.includes("scanbot-camera-controller")) {
        documentScannerController.close();
      } else if (controller.includes("barcode-scanner-controller") || controller.includes("barcode-scanner-overlay-controller")) {
        barcodeScannerController.close();
      } else if (controller.includes("mrz-scanner-controller")) {
        mrzScannerController.close();
      } else if (controller.includes("text-pattern-scanner-controller")) {
        textDataScannerController.close();
      } else if (controller.includes("detection-results-controller")) {
        documentListController.close();
      } else if (controller.includes("detection-result-controller")) {
        documentDetailsController.close();
        await documentListController.show();
      } else if (controller.includes("cropping-controller")) {
        croppingViewController.close();
      }
    };
  }

  const cameraSwapButtons = document.getElementsByClassName("camera-swap-button");

  for (let i = 0; i < cameraSwapButtons.length; i++) {
    const button = cameraSwapButtons[i];
    button.onclick = async (e) => {
      if (documentScannerController.documentScanner) {
        documentScannerController.documentScanner.swapCameraFacing(true);
      } else if (barcodeScannerController.barcodeScanner) {
        barcodeScannerController.barcodeScanner.swapCameraFacing(true);
      } else if (mrzScannerController.mrzScanner) {
        mrzScannerController.mrzScanner.swapCameraFacing(true);
      } else if (textDataScannerController.textDataScanner) {
        textDataScannerController.textDataScanner.swapCameraFacing(true);
      }
    };
  }

  const cameraSwitchButtons = document.getElementsByClassName("camera-switch-button");

  for (let i = 0; i < cameraSwitchButtons.length; i++) {
    const button = cameraSwitchButtons[i];
    button.onclick = async (e) => {
      if (documentScannerController.documentScanner) {
        switchCamera(documentScannerController.documentScanner);
      } else if (barcodeScannerController.barcodeScanner) {
        switchCamera(barcodeScannerController.barcodeScanner);
      } else if (mrzScannerController.mrzScanner) {
        switchCamera(mrzScannerController.mrzScanner);
      } else if (textDataScannerController.textDataScanner) {
        switchCamera(textDataScannerController.textDataScanner);
      }
    };
  }

  scanbotSDK = await ScanbotSDK.initialize({
    licenseKey: Config.license(),
    // Use the provided download-sdk.sh script to download the SDK locally and make the following path available.
    enginePath: './scanbot-web-sdk/bin/complete/'
  });

  ViewUtils.hideLoading();
};

async function switchCamera(scanner) {
  const cameras = await scanner?.fetchAvailableCameras()
  if (cameras) {
    const currentCameraInfo = scanner?.getActiveCameraInfo();
    if (currentCameraInfo) {
      const cameraIndex = cameras.findIndex((cameraInfo) => { return cameraInfo.deviceId == currentCameraInfo.deviceId });
      const newCameraIndex = (cameraIndex + 1) % (cameras.length);
      alert(`Current camera: ${currentCameraInfo.label}.\nSwitching to: ${cameras[newCameraIndex].label}`)
      scanner?.switchCamera(cameras[newCameraIndex].deviceId, false);
    }
  }
}

async function onScannerError(e) {
  console.log("Error:", e);
  await Utils.alert(e.name + ': ' + e.message);
}

async function updateResultImage(index) {
  const image = await Utils.renderDetectionResult(index);
  Utils.getElementByClassName("detection-result-container").innerHTML = image;
}

async function addAllPagesTo(generator, pageTransformer = async page => page) {
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    await generator.addPage(await pageTransformer(Utils.imageToDisplay(result)));
  }
}

function resizeContent() {
  const height = document.body.offsetHeight - (50 + 59);
  const controllers = document.getElementsByClassName("controller");

  for (let i = 0; i < controllers.length; i++) {
    const controller = controllers[i];
    controller.style.height = height;
  }
}
