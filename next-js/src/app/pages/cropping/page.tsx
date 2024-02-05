"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'

import Header from "../../subviews/header";
import ScanbotSDKService, { ScanbotDocument } from "@/app/services/scanbot-sdk-service";
import FloatingActionButton from "@/app/subviews/floating-action-button";

export default function Cropping() {

    const params = useSearchParams()

    const [document, setDocument] = useState<ScanbotDocument>();

    useEffect(() => {
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
                <FloatingActionButton
                    href={{ pathname: `/pages/document`, query: { id: params.get("id") } }}
                    icon={'icon_check.png'}
                    onClick={() => ScanbotSDKService.instance.applyCrop(document?.id!)}
                />
            </div>

        </div>
    )
}