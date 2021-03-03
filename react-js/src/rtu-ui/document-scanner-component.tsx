import React from "react";
import styled, {keyframes} from "styled-components";
import {NavigationContent} from "../subviews/navigation-content";
import {NavigationUtils} from "../utils/navigation-utils";
import {ScanbotSdkService} from "../service/scanbot-sdk-service";
import {BottomBar} from "../subviews/bottom-bar";

export default class DocumentScannerComponent extends React.Component<any, any> {


    async componentDidMount(): Promise<void> {
        await ScanbotSdkService.instance.createDocumentScanner(this.props.onDocumentDetected);
    }

    componentWillUnmount(): void {
        ScanbotSdkService.instance.disposeDocumentScanner()
    }

    navigation?: HTMLDivElement;

    toolbarHeight() {
        return 52;
        return this.navigation?.clientHeight ?? 0;
    }
    containerHeight() {
        // return "104px";
        // if (!this.navigation) {
        //     return "100%";
        // }
        return (window.innerHeight - 2 * this.toolbarHeight()) ?? 0;
    }

    barStyle() {
        return {
            display: "flex", height: this.toolbarHeight() + "px", width: "100%", backgroundColor: "red"
        }
    }

    render() {
        console.log("size", window.innerWidth, window.innerHeight, this.toolbarHeight());
        const animate = keyframes`
            from {transform: translateX(100%); } 
            to   {transform: translateX(0%); }
        `;
        const Push = styled.div`animation: ${animate} 1s;`;
        return (
            <Push id={"lol"} style={{height: "100%", width: "100%", position: "fixed", top: "0", left: "0", zIndex: 5000}}>
                <div style={this.barStyle()} ref={ref => this.navigation = ref as HTMLDivElement}>
                    {"Document Scanner"}
                </div>
                <div style={{height: this.containerHeight()}}>
                    <div id={ScanbotSdkService.DOCUMENT_SCANNER_CONTAINER} style={{width: "100%", height: "100%"}}/>
                </div>
                <div style={this.barStyle()} />
            </Push>
        );
    }
}
