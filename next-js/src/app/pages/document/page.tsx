"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'
import Image from 'next/image';

import Header from "../../subviews/header";
import ScanbotSDKService from "@/app/services/scanbot-sdk-service";
import Link from "next/link";

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
                <Link
                    href={{ pathname: `/pages/cropping`, query: { id: params.get("id") } }}
                    style={{
                        position: "absolute",
                        bottom: 15,
                        right: 15,
                        width: 60,
                        height: 60,
                        backgroundColor: "white",
                        borderRadius: "50%",
                        boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.25)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                    }}
                >
                    <Image color="white" width={40} height={40} src="/icon_crop.png" alt="crop" />
                </Link>
            </div>
        </div>
    )
}