
export class StorageService {

    public static instance = new StorageService();

    HAS_VISITED_KEY = "has-visited";
    HAS_VISITED_VALUE = "true";
    public getHasVisited(): boolean {return this.get(this.HAS_VISITED_KEY) === this.HAS_VISITED_VALUE;}
    public setHasVisited(): void {this.set(this.HAS_VISITED_KEY, this.HAS_VISITED_VALUE);}

    private set(key: string, value: string) {
        localStorage.setItem(key, value);
    }
    private get(key: string): any {
        return localStorage.getItem(key);
    }
}
