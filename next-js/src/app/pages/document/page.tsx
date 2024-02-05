"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

import Header from "../../subviews/header";
import ScanbotSDKService from "@/app/services/scanbot-sdk-service";
import FloatingActionButton from "@/app/subviews/floating-action-button";

export default function Document() {

    const router = useRouter()
    const params = useSearchParams()

    const [image, setImage] = useState<string>("");

    useEffect(() => {
        const document = ScanbotSDKService.instance.findDocument(params.get("id") as string);

        if (!document) {
            router.push('/', { scroll: false });
            return;
        }

        setImage(document?.image!);
        ScanbotSDKService.instance.onCropApplied = () => {
            setImage(document?.image!);
        }
    }, [router, params, image])

    return (
        <div>
            <Header backPath={"/pages/document-list"} />
            <div style={{
                width: "100%",
                height: "calc(100vh - 60px)",
                display: "flex",
                backgroundColor: "white",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 10,
                padding: 10,
                alignContent: "flex-start"
            }}>
                {/* Next.js attempts to optimize image loading by using the next/image component,
                  * but these images are fundamentally dynamic, revert to native html component 
                  */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image!} alt="X" style={{ maxWidth: "100%", height: "auto" }} />
                <FloatingActionButton
                    href={{ pathname: `/pages/cropping`, query: { id: params.get("id") } }}
                    icon={'icon_crop.png'}
                />
            </div>
        </div>
    )
}