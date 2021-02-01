import {Injectable} from "@angular/core";

@Injectable()
export class DocumentRepository {

  private readonly pages: any[];
  private page: any;

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

  getActiveItem() {
    return this.page;
  }

  setActiveItem(index: number) {
    this.page = this.pages[index];
  }
}
