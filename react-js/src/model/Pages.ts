import {DetectionResult} from "scanbot-web-sdk/@types/model/response/detection-result";

export default class Pages {

    public static instance = new Pages();

    private list: any[] = [];

    public add(page: DetectionResult) {
        this.list.push(page);
    }

    public get() {
        return this.list;
    }

    imageAtIndex(index: number) {
        const page = this.objectAtIndex(index);
        if (!page) {
            return undefined;
        }
        return page.filtered ?? page.cropped ?? page.original;
    }

    count() {
        return this.list.length;
    }

    objectAtIndex(index: number) {
        if (index === -1) {
            return undefined;
        }
        return this.list[index];

    }
}
