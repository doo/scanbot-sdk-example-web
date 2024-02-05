"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'

import Header from "../../subviews/header";
import ScanbotSDKService from "@/app/services/scanbot-sdk-service";

export default function Document() {

    const params = useSearchParams()

    const [image, setImage] = useState<string>("");

    useEffect(() => {
        console.log("params", params);
        const document = ScanbotSDKService.instance.findDocument(params.get("id") as string);
        setImage(document?.image!);
    }, [params, image])

    return (
        <div>
            <Header backPath={"/document-list"} />
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
                {/* Next.js attempts to optimize image loading by using the next/image component,
                  * but these images are fundamentally dynamic, revert to native html component 
                  */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image!} alt="X" style={{ maxWidth: "100%", height: "auto" }} />

            </div>
        </div>
    )
}