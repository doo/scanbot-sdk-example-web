"use client";

import Link from 'next/link';
import Image from 'next/image'

import { useEffect, useRef, useState } from 'react';

export default function Header(props: any) {


    useEffect(() => {
        console.log("backPath", props.backPath);
    }, [props, props.backPath]);

    return (
        <div style={{
            width: "100%",
            backgroundColor: "#c8193c",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            fontWeight: "200",
        }}>
            <Link
                style={{
                    position: "absolute",
                    left: 5,
                    width: 50,
                    height: 50,
                    visibility: props.backPath ? "visible" : "hidden",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                }}
                href={props.backPath ?? ""}>
                <Image color="white" width={40} height={30} src="/arrow_back.svg" alt="<" />
            </Link>
            <div style={{ marginLeft: "-10px", fontWeight: 500 }}>Scanbot</div>
            <div style={{ padding: "0 5px 0 5px" }}> Web</div>
            <div style={{ fontWeight: 500 }}>SDK</div>
        </div>
    )
}