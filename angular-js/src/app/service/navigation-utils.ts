import { RoutePaths } from "../model/RoutePaths";

export class NavigationUtils {
  public static getElementByClassName(name: string) {
    return document.getElementsByClassName(name)[0] as HTMLElement;
  }

  public static getElementById(id: string): HTMLElement | null {
    return document.getElementById(id);
  }

  public static showBackButton(show: boolean) {
    NavigationUtils.getElementById("back-button").style.display = show
      ? "block"
      : "none";
    NavigationUtils.getElementById("toolbar-logo").style.display = show
      ? "none"
      : "block";
  }

  public static showCameraSwapButton(show: boolean) {
    NavigationUtils.getElementById("camera-swap-button").style.display = show
      ? "block"
      : "none";
  }

  public static showCameraSwitchButton(show: boolean) {
    NavigationUtils.getElementById("camera-switch-button").style.display = show
      ? "block"
      : "none";
  }

  public static isAtPath(path: RoutePaths) {
    return window.location.href.includes(path);
  }
}
