"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'
import Image from 'next/image';

import Header from "../../subviews/header";
import ScanbotSDKService, { ScanbotDocument } from "@/app/services/scanbot-sdk-service";
import Link from "next/link";

export default function Cropping() {

    const params = useSearchParams()

    const [document, setDocument] = useState<ScanbotDocument>();

    useEffect(() => {
        console.log("params", params);
        const document = ScanbotSDKService.instance.findDocument(params.get("id") as string);
        setDocument(document!);
        async function open() { await ScanbotSDKService.instance.openCroppingView('cropping-view', document?.id) };
        open();
    }, [params, document])

    return (
        <div>
            <Header backPath={`/pages/document?id=${document?.id}`} />
            <div style={{
                display: "flex",
                padding: 10,
                backgroundColor: "white",
                height: "calc(100vh - 60px)",
            }}>
                <div id="cropping-view" style={{
                    backgroundColor: "rgb(230, 230, 230)",
                    width: "100%",
                    height: "calc(100vh - 200px)",
                    borderRadius: 5
                }} />
            </div>

        </div>
    )
}