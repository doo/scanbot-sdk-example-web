"use client";

import { useEffect } from "react";
import Header from "../../subviews/header";
import ScanbotSDKService from "../../services/scanbot-sdk-service";

export default function DocumentScanner() {
    
    useEffect(() => {
        ScanbotSDKService.instance.createDocumentScanner("document-scanner");

        return () => {
            ScanbotSDKService.instance.disposeDocumentScanner();
        };
    }, [])

    return (
        <div>
            <Header backPath={"/"} />
            <div id="document-scanner" style={{ width: "100%", height: "calc(100vh - 60px)" }} />
        </div>
    )
}