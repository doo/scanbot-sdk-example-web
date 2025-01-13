import { Injectable } from "@angular/core";
import { BarcodeItem, Image, ParametricFilter, Polygon, RawImage } from "scanbot-web-sdk/@types";

export class SBDocumentResult {
  originalImage: Image;
  croppedImage?: Image;
  filteredImage?: RawImage;

  polygon?: Polygon;
  rotations?: number;
  filter?: ParametricFilter;
}

@Injectable()
export class DocumentRepository {

  constructor() {
    this.pages = [];
  }

  private readonly pages: SBDocumentResult[];
  private activeIndex = -1;

  private readonly _barcodes: BarcodeItem[] = [];

  add(page: SBDocumentResult) {
    this.pages.push(page);
  }

  count(): number {
    return this.pages.length;
  }

  getPages() {
    return this.pages;
  }

  updateActiveItem(image: Image, polygon: Polygon, rotations: number) {
    this.pages[this.activeIndex].croppedImage = image;
    this.pages[this.activeIndex].polygon = polygon;
    this.pages[this.activeIndex].rotations = rotations;
  }

  hasActiveItem() {
    return this.activeIndex !== -1;
  }

  getActiveItem() {
    return this.pages[this.activeIndex];
  }

  removeActiveItem() {
    this.pages.splice(this.activeIndex, 1);
    this.activeIndex = -1;
  }

  setActiveItem(index: number) {
    this.activeIndex = index;
  }

  public addBarcodes(barcodes: BarcodeItem[]) {
    barcodes.forEach((barcode: BarcodeItem) => {
      this._barcodes.push(barcode);
    });
  }

  public barcodes() {
    return this._barcodes;
  }
}
