import {Injectable} from "@angular/core";

@Injectable()
export class DocumentRepository {

  private pages: any[];

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
}
