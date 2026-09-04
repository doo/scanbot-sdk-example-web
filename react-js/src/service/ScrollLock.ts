/**
 * Temporarily disables body scrolling (and its scrollbar) while an async task
 * runs, e.g. while a full-screen RTU UI component (document/barcode/MRZ
 * scanner) is open. The previous overflow value is restored afterwards,
 * even if the task throws.
 */
export async function withScrollLock<T>(task: () => Promise<T>): Promise<T> {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    try {
        return await task();
    } finally {
        document.body.style.overflow = previousOverflow;
    }
}
