import { Styles } from "../../model/styles";
import { CSSProperties } from "react";

export class Constants {
  public static readonly ACTION_BAR_HEIGHT = 52;

  public static barStyle() {
    return {
      display: "flex",
      width: "100%",
      height: this.ACTION_BAR_HEIGHT + "px",
      backgroundColor: Styles.colors.scanbot,
    };
  }

  public static barText(): CSSProperties {
    return {
      lineHeight: this.ACTION_BAR_HEIGHT + "px",
      color: "white",
      // position: "absolute",
      textAlign: "center",
      width: "100%",
      height: "100%",
    };
  }
}
