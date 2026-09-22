/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk/ui";
import { IDocumentCleanupViewHandle, Image } from "scanbot-web-sdk/@types";

// Mock the ScanbotSDK initialization for this snippet
const sdk = await ScanbotSDK.initialize({ licenseKey: "", enginePath: "" });

export class DocumentCleanup {

    configureButton(): void {
        const configuration = new ScanbotSDK.UI.Config.DocumentScanningFlow();
        configuration.screens.review.enabled = true;
        configuration.screens.review.toolbar.documentCleanupButton.barButton.visible = true;
    }

    async configureScanningFlow(): Promise<void> {
        const configuration = new ScanbotSDK.UI.Config.DocumentScanningFlow();

        configuration.screens.review.enabled = true;
        configuration.screens.review.toolbar.documentCleanupButton.barButton.visible = true;

        configuration.screens.cleanup.engineConfiguration.keepText = true;
        configuration.screens.cleanup.toolbar.strokeSizeSlider.visible = true;

        const result = await ScanbotSDK.UI.createDocumentScanner(configuration);
    }

    async configureCustomUI(pageImage: Image): Promise<void> {
        const configuration = {
            containerId: "document-cleanup-view-container",
            image: pageImage,
            cleanupConfiguration: {
                keepText: true,
            },
            style: {
                brush: {
                    size: 24,
                    color: "rgba(255, 0, 0, 0.4)",
                },
            },
        };

        const view = await sdk.openDocumentCleanupView(configuration);
    }

    async useCustomUI(cleanupView: IDocumentCleanupViewHandle) {
        // Run cleanup on the current brush strokes.
        const result = await cleanupView.apply();

        if (result.status === "OK_BUT_REDUCED_QUALITY") {
            // Inform the user, e.g. suggest undoing and cleaning a smaller area.
        }

        // Undo / redo / reset the cleanup history.
        await cleanupView.undo();
        await cleanupView.redo();
        await cleanupView.reset();

        // Drive your own undo/redo button state.
        const canUndo = await cleanupView.canUndo();
        const canRedo = await cleanupView.canRedo();

        // Discard the current, not-yet-applied brush strokes without running cleanup.
        cleanupView.clearBrushStrokes();

        // Update brush size/color, or any other configuration, after creation.
        cleanupView.updateConfiguration({ style: { brush: { size: 32 } } });

        // Dispose of the view when you are done with it.
        cleanupView.dispose();
    }
}
