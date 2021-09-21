export class NavigationUtils {
  static ROOT_HASH = "#/";
  static isAtRoot() {
    return (
      window.location.hash === this.ROOT_HASH || window.location.hash === ""
    );
  }

  static findRoute() {
    const route = window.location.hash?.replace(this.ROOT_HASH, "");
    if (route) {
      const split = route.split("?");
      if (split.length > 0) {
        return split[0];
      }
    }
    return undefined;
  }
}
