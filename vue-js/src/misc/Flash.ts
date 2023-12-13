export class Flash {
    flash() {
        const flash = document.getElementById("flash");
        flash!.style.display = "block";

        this.animateFlashOpacity(0.5, () => {
            this.animateFlashOpacity(0.0, () => {
                flash!.style.opacity = "1.0";
                flash!.style.display = "none";
            });
        });
    }

    animateFlashOpacity(opacity: number, complete: () => void) {
        const flash = document.getElementById("flash");
        setTimeout(() => {
            flash!.style.opacity = opacity.toString();
            complete();
        }, 150);
    }
}