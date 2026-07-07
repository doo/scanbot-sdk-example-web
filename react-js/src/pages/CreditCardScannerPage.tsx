import React, { useRef, useEffect } from "react";
import { CreditCardScanningResult } from "scanbot-web-sdk/@types";
import ScanbotSDK from "scanbot-web-sdk/ui";

type CreditCardScannerViewConfiguration = Parameters<ScanbotSDK["createCreditCardScanner"]>[0];
type ICreditCardScannerHandle = Awaited<ReturnType<ScanbotSDK["createCreditCardScanner"]>>;

import SBSDKService, { ContainerId } from "../service/SBSDKService";
import SBSDKPage from "../subviews/SBSDKPage";

function processCreditCardResult(result: CreditCardScanningResult): string {
    if (result.scanningStatus !== "SUCCESS" || !result.creditCard) {
        return `Scanning status: ${result.scanningStatus}`;
    }

    let text = "";
    for (const field of result.creditCard.fields) {
        if (field.value?.text) {
            text += `${field.type.commonType ?? field.type.name}: ${field.value.text}\n`;
        }
    }
    return text || "No fields detected.";
}

export default function CreditCardScannerPage() {

    const handle = useRef<ICreditCardScannerHandle | null>(null);
    const [toast, setToast] = React.useState<string | undefined>(undefined);

    const onCreditCardDetected = (result: CreditCardScanningResult) => {
        if (result.scanningStatus === "ERROR_NOTHING_FOUND") return;
        setToast(processCreditCardResult(result));
    };

    useEffect(() => {

        async function load() {
            await SBSDKService.initialize();
            const config: CreditCardScannerViewConfiguration = {
                containerId: ContainerId.CreditCardScanner,
                onCreditCardDetected: onCreditCardDetected,
                scannerConfiguration: {
                    processingMode: 'LIVE',
                },
            };
            handle.current = await SBSDKService.SDK.createCreditCardScanner(config);
        }

        load().then(() => {
            console.log("Scanbot SDK Credit Card Scanner is ready!");
        });

        return () => {
            handle.current?.dispose();
        };
    }, []);

    return <SBSDKPage title={"Credit Card Scanner"} containerId={ContainerId.CreditCardScanner} toast={{ text: toast }} />;
}
