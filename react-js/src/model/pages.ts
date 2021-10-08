export default class Pages {
  public static instance = new Pages();

  private list: any[] = [];
  private activeIndex: number = -1;

  public add(page: any) {
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

  setActiveItem(index: number) {
    this.activeIndex = index;
  }
  getActiveIndex() {
    return this.activeIndex;
  }

  updateActiveItem(result: any) {
    const existing = this.list[this.getActiveIndex()];
    existing.cropped = result.image;
    existing.polygon = result.polygon;
    existing.rotations = result.rotations;
  }

  getActiveItem() {
    return this.objectAtIndex(this.activeIndex);
  }

  hasActiveItem() {
    return this.getActiveIndex() !== -1;
  }

  removeActiveItem() {
    this.list.splice(this.getActiveIndex(), 1);
    this.activeIndex = -1;
  }
}
