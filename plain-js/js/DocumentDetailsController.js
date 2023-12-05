class DocumentDetailsController {

    constructor(results, croppingViewController) {
        this.results = results;
        this.croppingViewController = croppingViewController;
        this.container = Utils.getElementByClassName("detection-result-controller");
        this.parentControllerContainter = Utils.getElementByClassName("detection-results-controller");
        this.actionBarFilterSelect = Utils.getElementByClassName("action-bar-filter-select");

        this.actionBarFilterSelect.onchange = async (e) => {
            const index = Utils.getElementByClassName(
                "detection-result-image"
            ).getAttribute("index");
            const filter = e.target.value;

            ViewUtils.showLoading();
            if (filter === "none") {
                this.results[index].filtered = undefined;
            } else {
                let toFilter = this.results[index].cropped;
                if (!toFilter) {
                    toFilter = this.results[index].original;
                }

                this.results[index].filter = filter;
                this.results[index].filtered = await scanbotSDK.applyFilter(toFilter, filter);
            }

            await updateResultImage(index);
            ViewUtils.hideLoading();
        };

        Utils.getElementByClassName("crop-button").onclick = async (e) => {
            const resultIndex = Utils.getElementByClassName(
                "detection-result-image"
            ).getAttribute("index");

            await this.croppingViewController.show(resultIndex);
        };
    }

    async show(resultIndex, currentFilter) {
        this.parentControllerContainter.style.display = "none";
        this.container.style.display = "block";

        this.actionBarFilterSelect.selectedIndex = this.findFilterIndex(currentFilter);
        await updateResultImage(resultIndex);
    }

    close() {
        this.container.style.display = "none";
        this.parentControllerContainter.style.display = "block";
    }

    findFilterIndex(filter) {
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
}