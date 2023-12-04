const results = [];
let scanbotSDK, mrzScanner;
let croppingViewController, documentDetailsController, documentScannerController, barcodeScannerController;

window.onresize = () => {
  this.resizeContent();
};

window.onload = async () => {
  croppingViewController = new CroppingViewController(results);
  documentDetailsController = new DocumentDetailsController(results, croppingViewController);
  documentScannerController = new DocumentScannerController(results);
  barcodeScannerController = new BarcodeScannerController();

  this.resizeContent();

  Utils.getElementByClassName("delete-button").onclick = async (e) => {
    const index = Utils.getElementByClassName(
      "detection-result-image"
    ).getAttribute("index");

    results.splice(index, 1);

    const controller =
      e.target.parentElement.parentElement.parentElement.className;
    Utils.getElementByClassName(controller).style.display = "none";

    Utils.getElementByClassName(
      "detection-results-controller"
    ).style.display = "block";

    await reloadDetectionResults();
  };

  Utils.getElementByClassName("mrz-scanner-button").onclick = async (e) => {
    Utils.getElementByClassName("mrz-scanner-controller").style.display =
      "block";

    const config = {
      containerId: Config.mrzScannerContainerId(),
      onMrzDetected: onMrzDetected,
      onError: onScannerError,
      preferredCamera: 'camera2 0, facing back'
    };

    try {
      mrzScanner = await scanbotSDK.createMrzScanner(config);
    } catch (e) {
      console.log(e.name + ': ' + e.message);
      alert(e.name + ': ' + e.message);
      Utils.getElementByClassName("mrz-scanner-controller").style.display = "none";
    }
  };

  Utils.getElementByClassName("text-data-scanner-button").onclick = async (e) => {
    Utils.getElementByClassName("text-data-scanner-controller").style.display = "block";
    const config = {
      containerId: Config.textDataScannerContainerId(),
      onTextDetected: onTextDataDetected,
      onError: onScannerError,
      ocrResolutionLimit: 400,
      supportedLanguages: ['eng', 'deu'],
      preferredCamera: 'camera2 0, facing back'
    };

    textDataScanner = await scanbotSDK.createTextDataScanner(config);
  };

  Utils.getElementByClassName("scanner-results-button").onclick = async (e) => {
    Utils.getElementByClassName("detection-results-controller").style.display =
      "block";
    await reloadDetectionResults();
  };

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

        const analyzer = await scanbotSDK.createDocumentQualityAnalyzer();
        console.log('Document Analysis:', await analyzer.analyze(reader.result));
        await analyzer.release();

        if (result.success === true) {
          const cropped = await scanbotSDK.cropAndRotateImageCcw(reader.result, result.polygon, 0);
          result.original = reader.result;
          result.cropped = cropped;

          results.push(result);
          Utils.getElementByClassName(
            "detection-results-controller"
          ).style.display = "block";
          await reloadDetectionResults();

        } else {
          alert("Detection failed");
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
          onBarcodesDetected(result);
        } else {
          alert("Detection failed");
        }

        console.log("barcode detection result", result);
      };
    };
  };

  Utils.getElementByClassName("license-info-button").onclick = async (e) => {
    const info = await scanbotSDK.getLicenseInfo();
    alert(JSON.stringify(info));
  };


  Utils.getElementByClassName("pdf-button").onclick = async (e) => {
    if (results.length === 0) {
      console.log("No image results to save");
      return;
    }
    ViewUtils.showLoading();
    const generator = await scanbotSDK.beginPdf({
      standardPaperSize: "A4",
      landscape: true,
    });
    await addAllPagesTo(generator);
    const bytes = await generator.complete();
    Utils.saveBytes(bytes, Utils.generateName() + ".pdf");
    ViewUtils.hideLoading();
  };

  Utils.getElementByClassName("tiff-button").onclick = async (e) => {
    if (results.length === 0) {
      console.log("No image results to save");
      return;
    }
    ViewUtils.showLoading();
    const generator = await scanbotSDK.beginTiff({
      binarizationFilter: "deepBinarization",
      dpi: 123,
    });
    await addAllPagesTo(generator);
    const bytes = await generator.complete();
    Utils.saveBytes(bytes, Utils.generateName() + ".tiff");
    ViewUtils.hideLoading();
  };

  const backButtons = document.getElementsByClassName("back-button");

  for (let i = 0; i < backButtons.length; i++) {
    const button = backButtons[i];
    button.onclick = async (e) => {
      const controller =
        e.target.parentElement.parentElement.parentElement.className;
      Utils.getElementByClassName(controller).style.display = "none";

      if (controller.includes("scanbot-camera-controller")) {
        documentScannerController.close();
      } else if (controller.includes("barcode-scanner-controller") || controller.includes("barcode-scanner-overlay-controller")) {
        barcodeScannerController.close();
      } else if (controller.includes("mrz-scanner-controller")) {
        mrzScanner.dispose();
        mrzScanner = undefined;
      } else if (controller.includes("text-data-scanner-controller")) {
        textDataScanner.dispose();
        textDataScanner = undefined;
      } else if (controller.includes("detection-results-controller")) {
      } else if (controller.includes("detection-result-controller")) {
        documentDetailsController.close();
        await reloadDetectionResults();
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
      } else if (mrzScanner) {
        mrzScanner.swapCameraFacing(true);
      } else if (textDataScanner) {
        textDataScanner.swapCameraFacing(true);
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
      } else if (mrzScanner) {
        switchCamera(mrzScanner);
      } else if (textDataScanner) {
        switchCamera(textDataScanner);
      }
    };
  }

  scanbotSDK = await ScanbotSDK.initialize({ licenseKey: Config.license(), engine: '/wasm/' });
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

function toConfidenceString(input, key) {

  const confidence = input[key].confidence;

  if (!confidence) {
    return "";
  }

  return ` (${Number(confidence).toFixed(3)})`;
}

function parseMRZValue(input, key) {
  return input[key] ? (input[key].value + toConfidenceString(input, key)) : ''
}

async function onMrzDetected(mrz) {
  mrzScanner.pauseDetection();

  let text = "";
  if (mrz) {

    text += "Document Type: " + parseMRZValue(mrz, "documentType") + "\n";
    text += "First Name: " + parseMRZValue(mrz, "givenNames") + "\n";
    text += "Last Name: " + parseMRZValue(mrz, "surname") + "\n";
    text += "Issuing Authority: " + parseMRZValue(mrz, "issuingAuthority") + "\n";
    text += "Nationality: " + parseMRZValue(mrz, "nationality") + "\n";
    text += "Birth Date: " + parseMRZValue(mrz, "birthDate") + "\n";
    text += "Gender: " + parseMRZValue(mrz, "gender") + "\n";
    text += "Date of Expiry: " + parseMRZValue(mrz, "expiryDate") + "\n";
  } else {
    text = "No MRZ fields detected";
  }

  alert(text);

  setTimeout(() => {
    mrzScanner.resumeDetection();
  }, 1000);
}

async function onTextDataDetected(textData) {
  if (!textData) return;

  if (textData.validated) {
    if (typeof textDataScanner !== 'undefined') {
      textDataScanner.pauseDetection();
    }

    alert(textData.text);

    if (typeof textDataScanner !== 'undefined') {
      setTimeout(() => { textDataScanner.resumeDetection() }, 500);
    }
  }

}

async function onScannerError(e) {
  console.log("Error:", e);
  alert(e.name + ': ' + e.message);
}

async function reloadDetectionResults() {
  const container = Utils.getElementByClassName("detection-results-container");
  container.innerHTML = await Utils.renderDetectionResults();
  const size = container.offsetWidth / 3;

  const items = document.getElementsByClassName("detection-result-list-image");
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    item.style.width = size;
    item.style.height = size;
    item.onclick = onDetectionResultClick;
  }
}

async function onDetectionResultClick(e) {
  const index = e.target.getAttribute("index");
  const currentFilter = results[index].filter;
  await documentDetailsController.show(index, currentFilter);
}

function findFilterIndex(filter) {
  const options = Utils.getElementByClassName(
    "action-bar-filter-select"
  ).options;
  for (let i = 0; i < options.length; i++) {
    if (options[i].value === filter) {
      return i;
    }
  }

  return 0;
}

async function updateResultImage(index) {
  const image = await Utils.renderDetectionResult(index);
  Utils.getElementByClassName("detection-result-container").innerHTML = image;
}

async function addAllPagesTo(generator) {
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    await generator.addPage(Utils.imageToDisplay(result));
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
