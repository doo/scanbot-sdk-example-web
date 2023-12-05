class DocumentListController {

    constructor(results) {
        this.container = Utils.getElementByClassName("detection-results-controller");
        this.results = results;

        Utils.getElementByClassName("scanner-results-button").onclick = async (e) => {
            await this.show();
        }

        Utils.getElementByClassName("pdf-button").onclick = async (e) => {
            await this.createPdf();
        };

        Utils.getElementByClassName("tiff-button").onclick = async (e) => {
            await this.createTiff();
        };

        Utils.getElementByClassName("delete-button").onclick = async (e) => {
            await this.onDelete(e);
        };
    }

    async show() {
        this.container.style.display = "block";
        await this.reloadDetectionResults();
    }

    close() {
        this.container.style.display = "none";
    }

    async createPdf() {
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
    }

    async createTiff() {
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
    }

    async onDelete(e) {
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

        await this.reloadDetectionResults();
    }

    async reloadDetectionResults() {
        const container = Utils.getElementByClassName("detection-results-container");
        container.innerHTML = await Utils.renderDetectionResults();
        const size = container.offsetWidth / 3;

        const items = document.getElementsByClassName("detection-result-list-image");
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            item.style.width = size;
            item.style.height = size;
            item.onclick = (e) => {
                this.onDetectionResultClick(e);
            }
        }
    }

    async onDetectionResultClick(e) {
        const index = e.target.getAttribute("index");
        const currentFilter = results[index].filter;
        await documentDetailsController.show(index, currentFilter);
    }
}