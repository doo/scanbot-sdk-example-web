"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

import Header from "../../subviews/header";
import ScanbotSDKService, { ScanbotDocument } from "@/app/services/scanbot-sdk-service";
import FloatingActionButton from "@/app/subviews/floating-action-button";
import DocumentFetch from "@/app/services/DocumentFetch";

export default function Cropping() {

    const router = useRouter()
    const [document, setDocument] = useState<ScanbotDocument>();

    return (
        <div>
            <Header backPath={`/pages/document?id=${document?.id}`} />
            <div style={{
                display: "flex",
                padding: 10,
                backgroundColor: "white",
                height: "calc(100vh - 60px)",
            }}>
                <Suspense fallback={<div>Loading...</div>}>
                    <DocumentFetch onDocumentFound={async (document: ScanbotDocument) => {
                        setDocument(document)
                        await ScanbotSDKService.instance.openCroppingView('cropping-view', document?.id)
                    }} />
                </Suspense>
                <div id="cropping-view" style={{
                    backgroundColor: "rgb(230, 230, 230)",
                    width: "100%",
                    height: "calc(100vh - 200px)",
                    borderRadius: 5
                }} />
                <FloatingActionButton
                    href={{ pathname: `/pages/document`, query: { id: document?.id } }}
                    icon={'icon_check.png'}
                    onClick={() => {
                        ScanbotSDKService.instance.applyCrop(document?.id!);
                        router.back();
                    }}
                />
            </div>

        </div>
    )
}