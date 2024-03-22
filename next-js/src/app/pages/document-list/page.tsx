"use client";

import { useEffect } from "react";
import Image from 'next/image';

import Header from "../../subviews/header";
import ScanbotSDKService from "@/app/services/scanbot-sdk-service";
import Link from "next/link";

export default function DocumentList() {

    useEffect(() => {

    }, [])

    return (
        <div>
            <Header backPath={"/"} />
            <div style={{
                width: "100%",
                height: "calc(100vh - 60px)",
                display: "flex",
                backgroundColor: "white",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 10,
                paddingTop: 10,
                alignContent: "flex-start"
            }}>
                {!ScanbotSDKService.instance.hasDocuments() && <div style={{ color: "rgb(100, 100, 100)", marginTop: -100 }}>
                    No documents
                </div>}
                {ScanbotSDKService.instance.getDocuments().map((document) => {
                    return (
                        <div key={document.id} style={{ flexBasis: "30%" }}>
                            <Link href={{ pathname: `/pages/document`, query: { id: document.id } }}>
                                {/* Next.js attempts to optimize image loading by using the next/image component,
                                    but these images are fundamentally dynamic, revert to native html component */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={document.image!} alt="X" style={{ maxWidth: "100%", height: "auto" }} />
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}