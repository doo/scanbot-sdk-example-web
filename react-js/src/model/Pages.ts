import {DetectionResult} from "scanbot-web-sdk/@types/model/response/detection-result";

export default class Pages {

    public static instance = new Pages();

    private list: DetectionResult[] = [];

    public add(page: DetectionResult) {
        this.list.push(page);
    }

    public get() {
        return this.list;
    }
}
