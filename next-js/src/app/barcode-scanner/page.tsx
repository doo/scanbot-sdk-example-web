"use client";

import { useEffect } from "react";
import Header from "../subviews/header";
import ScanbotSDKService from "../services/scanbot-sdk-service";
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BarcodeScanner() {

    useEffect(() => {
        ScanbotSDKService.instance.createBarcodeScanner("barcode-scanner", async (barcode) => {
            // barcode.barcodeImage
            const base64Image = await ScanbotSDKService.instance.sdk?.toDataUrl(barcode.barcodeImage);
            toast.success(`Detected code: ${barcode.text} (${barcode.format})`, {
                icon: ({theme, type}) =>  <Image width={25} height={25} src={base64Image!} alt="X"/>
              });
        });

        return () => {
            ScanbotSDKService.instance.disposeBarcodeScanner();
        };
    }, [])

    return (
        <div>
            <Header backPath={"/"} />
            <div id="barcode-scanner" style={{ width: "100%", height: "calc(100vh - 50px)" }} />
            <ToastContainer />
        </div>
    )
}