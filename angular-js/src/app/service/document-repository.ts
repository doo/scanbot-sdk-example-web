import {Injectable} from "@angular/core";
import {Polygon} from "scanbot-web-sdk/@types";

@Injectable()
export class DocumentRepository {

  private readonly pages: any[];
  private activeIndex: number = -1;

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

  updateActiveItem(image: Uint8Array, polygon: Polygon, rotations: number) {
    this.pages[this.activeIndex].cropped = image;
    this.pages[this.activeIndex].polygon = polygon;
    this.pages[this.activeIndex].rotations = rotations;
  }

  hasActiveItem() {
    return this.activeIndex !== -1
  }
  getActiveItem() {
    return this.pages[this.activeIndex];
  }

  setActiveItem(index: number) {
    this.activeIndex = index;
  }
}
