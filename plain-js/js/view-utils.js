class ViewUtils {
  static showLoading() {
    Utils.getElementByClassName("loading-screen").style.display = "block";
  }
  static hideLoading() {
    Utils.getElementByClassName("loading-screen").style.display = "none";
  }

  static flash() {
    const flash = Utils.getElementByClassName("flash");
    flash.style.display = "block";

    this.animateFlashOpacity(0.5, () => {
      this.animateFlashOpacity(0.0, () => {
        flash.style.opacity = 1.0;
        flash.style.display = "none";
      });
    });
  }

  static animateFlashOpacity(opacity, complete) {
    const flash = Utils.getElementByClassName("flash");
    setTimeout(() => {
      flash.style.opacity = opacity;
      complete();
    }, 150);
  }
}
