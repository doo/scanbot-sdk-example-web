
export class StorageService {

    public static instance = new StorageService();

    HAS_VISITED_KEY = "has-visited";
    HAS_VISITED_VALUE = "true";
    public getHasVisited(): boolean {return this.get(this.HAS_VISITED_KEY) === this.HAS_VISITED_VALUE;}
    public setHasVisited(): void {this.set(this.HAS_VISITED_KEY, this.HAS_VISITED_VALUE);}
    SHOW_ALERT_KEY = "show-alert";
    SHOW_ALERT_VALUE = "true";
    public getShowAlert(): boolean {return this.get(this.SHOW_ALERT_KEY) === this.SHOW_ALERT_VALUE;}
    public setShowAlert(newValue: boolean): void {this.set(this.SHOW_ALERT_KEY, newValue);}

    private set(key: string, value: any) {
        localStorage.setItem(key, value);
    }
    private get(key: string): any {
        return localStorage.getItem(key);
    }



    public deletePage(props: any) {
        console.log('deletiiiing');
        // Pages.instance.removeActiveItem();
        // RoutingService.instance.route(RoutePath.ImageResults);
        props.history.push('./view-doc')
    }
}
