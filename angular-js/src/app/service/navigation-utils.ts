import {RoutePaths} from "../model/RoutePaths";

export class NavigationUtils {

  public static getElementByClassName(name: string) {
    return document.getElementsByClassName(name)[0] as HTMLElement;
  }

  public static showBackButton(show: boolean) {
    NavigationUtils.getElementByClassName("back-button").style.display = show ? "block" : "none";
    NavigationUtils.getElementByClassName("toolbar-logo").style.display = show ? "none" : "block";
  }

  public static isAtPath(path: RoutePaths) {
    return window.location.href.includes(path);
  }
}
