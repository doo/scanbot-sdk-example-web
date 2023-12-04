class DocumentDetailsController{

    constructor(results) {
        this.results = results;
        this.container = Utils.getElementByClassName("detection-result-controller");
        this.parentControllerContainter = Utils.getElementByClassName("detection-results-controller");
        this.actionBarFilterSelect = Utils.getElementByClassName("action-bar-filter-select");

        Utils.getElementByClassName("action-bar-filter-select").onchange = async (
            e
        ) => {
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

    }

    async show(resultIndex, currentFilter){
        this.parentControllerContainter.style.display = "none";
        this.container.style.display = "block";

        Utils.getElementByClassName("action-bar-filter-select").selectedIndex =
            findFilterIndex(currentFilter);
        await updateResultImage(resultIndex);
    }

    close() {
        this.container.style.display = "none";
        this.parentControllerContainter.style.display = "block";
    }
}