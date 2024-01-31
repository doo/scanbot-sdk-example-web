"use client";

import { useEffect } from "react";
import Header from "../subviews/header";
import ScanbotSDKService from "../services/scanbot-sdk-service";

export default function BarcodeScanner() {

    useEffect(() => {
        ScanbotSDKService.instance.createBarcodeScanner("barcode-scanner");

        return () => {
            ScanbotSDKService.instance.disposeBarcodeScanner();
        };
    }, [])

    return (
        <div>
            <Header backPath={"/"} />
            <div id="barcode-scanner" style={{ width: "100%", height: "calc(100vh - 50px)" }} />
        </div>
    )
}