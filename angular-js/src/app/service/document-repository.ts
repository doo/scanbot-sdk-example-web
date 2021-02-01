import {Injectable} from "@angular/core";
import {Polygon} from "scanbot-web-sdk/@types/model/response/detection-result";

@Injectable()
export class DocumentRepository {

  private readonly pages: any[];
  private activeIndex: number;

  constructor() {
    this.pages = [];
  }

  add(page: any) {
    this.pages.push(page);
  }

  count(): number {
    return this.pages.length;
  }

  getPages() {
    return this.pages;
  }

  updateActiveItem(image: Uint8Array, polygon: Polygon) {
    this.pages[this.activeIndex].cropped = image;
    this.pages[this.activeIndex].polygon = polygon;
  }
  
  getActiveItem() {
    return this.pages[this.activeIndex];
  }

  setActiveItem(index: number) {
    this.activeIndex = index;
  }
}
