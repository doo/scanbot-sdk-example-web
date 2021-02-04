import {CSSProperties} from "react";

export class Styles {

    static backButton: CSSProperties = {
        backgroundColor: "transparent",
        border: "none",
        color: "white",
        width: "50px",
        fontSize: "30px",
        textAlign: "center"
    };

    static documentImage: CSSProperties = {
        width: "100%",
        height: "100%",
        transform: "none",
        top: "0",
        objectFit: "contain"
    };
    static bottomBarButton: CSSProperties = {
        width: "80px",
        fontSize: "14px",
        fontWeight: "bold",
        height: "100%",
        textAlign: "center",
        lineHeight: "50px",
        color: "white",
        padding: 0,
        margin: 0,
        border: "none",
        backgroundColor: "transparent"
    };

}
