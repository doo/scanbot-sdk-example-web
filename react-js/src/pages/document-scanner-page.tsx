
import React from "react";
import {ScanbotSdkService} from "../service/scanbot-sdk-service";
import styled, {keyframes} from "styled-components";

export default class DocumentScannerPage extends React.Component<any, any>{


    async componentDidMount(): Promise<void> {
        await ScanbotSdkService.instance.createDocumentScanner(this.props.onDocumentDetected);
    }

    componentWillUnmount(): void {
        ScanbotSdkService.instance.disposeDocumentScanner()
    }

    render() {
        console.log("size", window.innerWidth, window.innerHeight);
        const animate = keyframes`
            from {transform: translateX(100%); } 
            to   {transform: translateX(0%); }
        `;
        const Push = styled.div`animation: ${animate} 1s;`;
        return (
            <Push style={{height: "100%"}}>
                    <div id={ScanbotSdkService.DOCUMENT_SCANNER_CONTAINER} style={{width: "100%", height: "100%"}}/>
            </Push>
        );
    }
}
