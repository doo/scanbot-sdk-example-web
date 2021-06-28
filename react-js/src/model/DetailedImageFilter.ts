import {BinarizationFilter, ColorFilter} from "scanbot-web-sdk/@types";

export default class DetailedImageFilter {

    name: ColorFilter | BinarizationFilter | "none";

    description: string;

    selected: boolean = false;

    constructor(name: ColorFilter | BinarizationFilter | "none", description: string) {
        this.name = name;
        this.description = description;
    }
}
