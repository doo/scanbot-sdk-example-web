
/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk/ui";

export async function runDocumentScanner() {
    // Make sure you have called await ScanbotSDK.initialize(...) before continuing here. 
    
    const config = new ScanbotSDK.UI.Config.DocumentScanningFlow();
    // Adjust the config here to your needs.
    
    const result = await ScanbotSDK.UI.createDocumentScanner(config);
    // Process the result as needed.
    
    return result;
}
