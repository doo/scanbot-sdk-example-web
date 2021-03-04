
export default class ViewUtils {

  public static flash() {
    const flash = document.getElementsByClassName("flash")[0] as HTMLDivElement;
    flash.style.display = "block";

    this.animateFlashOpacity("0.5", () => {
      this.animateFlashOpacity("0.0", () => {
        flash.style.opacity = "1.0";
        flash.style.display = "none";
      })
    });
  }
  private static animateFlashOpacity(opacity, complete) {
    const flash = document.getElementsByClassName("flash")[0] as HTMLDivElement;
    setTimeout(() => {
      flash.style.opacity = opacity;
      complete();
    }, 150);
  }
}
