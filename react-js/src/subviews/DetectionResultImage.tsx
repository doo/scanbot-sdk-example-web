import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageListItem, Skeleton } from "@mui/material";
import { SBStoreCroppedDetectionResult } from "scanbot-web-sdk/@types";
import SBSDKService from "../service/SBSDKService";
import ImageUtils from "../service/ImageUtils.ts";

export class Props {
    item!: SBStoreCroppedDetectionResult;
}

export default function DetectionResultImage(props: Props) {
    const navigate = useNavigate();
    const [base64Image, setBase64Image] = useState<string | null>(null);

    useEffect(() => {
        async function loadImages() {
            const images = await SBSDKService.SDK.storage.getCroppedDetectionResultImage(props.item.id);
            const base64 = await ImageUtils.createBase64Image(props.item, images);
            setBase64Image(base64);
        }

        loadImages();
    }, [props.item.id]);

    return (
        <ImageListItem key={props.item.id} style={{}}>
            <Skeleton variant="rectangular" width="100%" height={164}
                      style={{ display: base64Image ? "none" : "block" }} />
            <img src={`${base64Image}`} alt={`Storage image ${props.item.id}`}
                 style={{
                     display: base64Image ? "block" : "none",
                     width: "100%",
                     height: "100%",
                     objectFit: "contain",
                     backgroundColor: "rgba(100, 100, 100, 0.1)"
                 }}
                 onClick={() => {
                     navigate(`details?item=${props.item.id}`);
                 }}
            />
        </ImageListItem>
    )
}
