
const results = [];
let scanbotSDK, documentScanner, barcodeScanner, croppingView;

window.onresize = () => {
    this.resizeContent();
};

window.onload = async () => {

    this.resizeContent();

    Utils.getElementByClassName("document-scanner-button").onclick = async (e) => {
        Utils.getElementByClassName("scanbot-camera-controller").style.display = "block";

        const config = {
            containerId: Config.scannerContainerId(),
            acceptedAngleScore: 60,
            acceptedSizeScore: 60,
            autoCaptureSensitivity: 0.66,
            autoCaptureEnabled: true,
            ignoreBadAspectRatio: false,
            onDocumentDetected: onDocumentDetected,
            onError: onScannerError
        };

        documentScanner = await scanbotSDK.createDocumentScanner(config);
    };

    Utils.getElementByClassName("detection-done-button").onclick = async (e) => {
        documentScanner.dispose();
        Utils.getElementByClassName("scanbot-camera-controller").style.display = "none";
        Utils.getElementByClassName("detection-results-controller").style.display = "block";

        await reloadDetectionResults();
    };

    Utils.getElementByClassName("crop-button").onclick = async (e) => {
        Utils.getElementByClassName("detection-result-controller").style.display = "none";
        Utils.getElementByClassName("cropping-controller").style.display = "block";

        const index = Utils.getElementByClassName("detection-result-image").getAttribute("index");
        const options = {
            containerId: Config.croppingViewContainerId(),
            image: results[index].original,
            polygon: results[index].polygon,
            rotations: results[index].rotations ?? 0,
            disableScroll: true,
            style: {
                padding: 20,
                polygon: {
                    color: "green",
                    width: 4,
                    handles: {
                        size: 14,
                        color: "white",
                        border: "1px solid lightgray"
                    }
                },
                magneticLines: {
                    // disabled: true,
                    color: "red"
                }
            }
        };
        croppingView = await scanbotSDK.openCroppingView(options);
    };
    Utils.getElementByClassName("barcode-scanner-button").onclick = async (e) => {
        Utils.getElementByClassName("barcode-scanner-controller").style.display = "block";

        const config = {
            containerId: Config.barcodeScannerContainerId(),
            // style: {
            //     window: {
            //         borderColor: "blue"
            //     },
            //     text: {
            //         color: "red",
            //         weight: 500
            //     }
            // },
            onBarcodesDetected: onBarcodesDetected,
            onError: onScannerError
        };

        barcodeScanner = await scanbotSDK.createBarcodeScanner(config);
    };
    Utils.getElementByClassName("scanner-results-button").onclick = async (e) => {
        Utils.getElementByClassName("detection-results-controller").style.display = "block";
        await reloadDetectionResults();
    };

    Utils.getElementByClassName("pick-image-button").onclick = (e) => {
        const picker = Utils.getElementByClassName("file-picker");
        picker.click();

        picker.onchange = (e) => {
            console.log("change");
            e.preventDefault();
            let reader = new FileReader();
            let file = e.target.files[0];
            reader.readAsArrayBuffer(file);

            reader.onload = async (e) => {
                results.push({original: new Int8Array(reader.result)});
                Utils.getElementByClassName("detection-results-controller").style.display = "block";
                await reloadDetectionResults();
            };
        };
    };

    Utils.getElementByClassName("license-info-button").onclick = async (e) => {
        const info = await scanbotSDK.getLicenseInfo();
        alert(JSON.stringify(info));
    };

    Utils.getElementByClassName("detect-button").onclick = async (e) => {
        await croppingView.detect();
    };

    Utils.getElementByClassName("rotate-button").onclick = async (e) => {
        await croppingView.rotate(1);
    };

    Utils.getElementByClassName("apply-button").onclick = async (e) => {
        ViewUtils.showLoading();
        const result = await croppingView.apply();
        croppingView.dispose();
        const index = Utils.getElementByClassName("detection-result-image").getAttribute("index");
        results[index].filtered = undefined;
        results[index].cropped = result.image;
        results[index].polygon = result.polygon;
        results[index].rotations = result.rotations;

        if (results[index].filter) {
            results[index].filtered = await scanbotSDK.applyFilter(results[index].cropped, results[index].filter);
        }

        Utils.getElementByClassName("cropping-controller").style.display = "none";
        Utils.getElementByClassName("detection-result-controller").style.display = "block";

        await updateResultImage(index);
        ViewUtils.hideLoading();
    };

    Utils.getElementByClassName("pdf-button").onclick = async (e) => {
        if (results.length === 0) {
            console.log("No image results to save");
            return;
        }
        ViewUtils.showLoading();
        const generator = await scanbotSDK.beginPdf({standardPaperSize: "A4", landscape: true, dpi: 100});
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
        const generator = await scanbotSDK.beginTiff({binarizationFilter: "deepBinarization", dpi: 123});
        await addAllPagesTo(generator);
        const bytes = await generator.complete();
        Utils.saveBytes(bytes,Utils.generateName() + ".tiff");
        ViewUtils.hideLoading();
    };

    Utils.getElementByClassName("action-bar-filter-select").onchange = async (e) => {

        const index = Utils.getElementByClassName("detection-result-image").getAttribute("index");
        const filter = e.target.value;

        ViewUtils.showLoading();
        if (filter === "none") {
            results[index].filtered = undefined;
        } else {
            const toFilter = results[index].cropped ?? results[index].original;
            results[index].filter = filter;
            results[index].filtered = await scanbotSDK.applyFilter(toFilter, filter);
        }

        await updateResultImage(index);
        ViewUtils.hideLoading();
    };

    const backButtons = document.getElementsByClassName("back-button");

    for (let i = 0; i < backButtons.length; i++) {
        const button = backButtons[i];
        button.onclick = async (e) => {
            const controller = e.target.parentElement.parentElement.parentElement.className;
            Utils.getElementByClassName(controller).style.display = "none";

            if (controller.includes("scanbot-camera-controller")) {
                documentScanner.dispose();
            } else if (controller.includes("barcode-scanner-controller")) {
                barcodeScanner.dispose();
            } else if (controller.includes("detection-results-controller")) {

            } else if (controller.includes("detection-result-controller")) {
                Utils.getElementByClassName("detection-results-controller").style.display = "block";
                await reloadDetectionResults();
            } else if (controller.includes("cropping-controller")) {
                Utils.getElementByClassName("detection-result-controller").style.display = "block";
                croppingView.dispose();
            }
        };
    }

    scanbotSDK = await ScanbotSDK.initialize({ licenseKey: Config.license() });
    ViewUtils.hideLoading();
};

async function onBarcodesDetected(e) {
    let text = "";
    e.barcodes.forEach(barcode => {
        text += " " + barcode.text + " (" + barcode.format + "),";
    });

    Toastify({text: text.slice(0, -1), duration: 3000}).showToast();
}

async function onDocumentDetected(e) {
    results.push(e);
    ViewUtils.flash();
    Utils.getElementByClassName("page-count-indicator").innerHTML = (results.length) + " PAGES";
}

async function onScannerError(e) {
    console.log("Error:", e);
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
    Utils.getElementByClassName("detection-results-controller").style.display = "none";
    Utils.getElementByClassName("detection-result-controller").style.display = "block";

    const index = e.target.getAttribute("index");
    Utils.getElementByClassName("action-bar-filter-select").selectedIndex = findFilterIndex(results[index].filter);
    await updateResultImage(index);
}

function findFilterIndex(filter) {
    const options = Utils.getElementByClassName("action-bar-filter-select").options;
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

    for (let i = 0; i < controllers.length; i ++) {
        const controller = controllers[i];
        controller.style.height = height;
    }
}

