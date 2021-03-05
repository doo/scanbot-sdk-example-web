import React, {CSSProperties} from "react";
import styled, {keyframes} from "styled-components";
import {ScanbotSdkService} from "../service/scanbot-sdk-service";
import {Styles} from "../model/styles";
import {DocumentDetectionResult} from "scanbot-web-sdk/@types";
import BaseScannerComponent from "./base-scanner-component";
import {AnimationType} from "./enum/animation-type";

export default class DocumentScannerComponent extends BaseScannerComponent {

    render() {
        if (this.state.animation.type === AnimationType.None) {
            return null;
        }
        const Animation = this.animation(this.state.animation.type);
        return (
            <Animation
                id={"lol"}
                style={this.containerStyle(`${this.to(this.state.animation.type)}`)}
                onAnimationStart={this.onAnimationStart.bind(this)}
                onAnimationEnd={this.onAnimationEnd.bind(this)}
            >
                <div style={this.barStyle()}>
                    <button
                        style={Styles.backButton}
                        onClick={() => this.pop()}
                        dangerouslySetInnerHTML={{__html: "&#8249"}}
                    />
                    <div style={this.barText()}>{"Document Scanner"}</div>
                </div>
                <div style={{height: this.containerHeight(), backgroundColor: "black"}}>
                    <div id={ScanbotSdkService.DOCUMENT_SCANNER_CONTAINER} style={{width: "100%", height: "100%"}}/>
                </div>
                <div style={this.barStyle()}/>
            </Animation>
        );
    }

    onDocumentDetected(result: DocumentDetectionResult) {
        console.log("Detected", result);
    }

    async push(type: AnimationType) {
        this.pushType = type;
        this.updateAnimationType(type, async () => {
            await ScanbotSdkService.instance.createDocumentScanner(this.onDocumentDetected);
        });
    }

    pop() {
        this.updateAnimationType(AnimationType.Pop, () => {
            ScanbotSdkService.instance.disposeDocumentScanner();
        });
    }
}
