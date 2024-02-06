
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import ScanbotSDKService, { ScanbotDocument } from "./scanbot-sdk-service";

export default function DocumentFetch(props: { onDocumentFound: (document: ScanbotDocument) => void }) {

    const router = useRouter()
    const params = useSearchParams()

    useEffect(() => {
        const document = ScanbotSDKService.instance.findDocument(params.get("id") as string);

        if (!document) {
            router.push('/', { scroll: false });
            return;
        }
        props.onDocumentFound(document);
    }, [router, params, props])

    return null
}