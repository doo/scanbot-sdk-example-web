import React, {CSSProperties} from "react";
import styled, {keyframes} from "styled-components";
import {ScanbotSdkService} from "../service/scanbot-sdk-service";
import {Styles} from "../model/styles";
import {DocumentDetectionResult} from "scanbot-web-sdk/@types";

export enum AnimationType {
    None,
    PushRight,
    PushBottom,
    Pop
}

export default class DocumentScannerComponent extends React.Component<any, any> {


    constructor(props: any) {
        super(props);

        this.state = {
            animation: {
                type: AnimationType.None
            }
        }
    }

    navigation?: HTMLDivElement;

    toolbarHeight() {
        return 52;
    }
    containerHeight() {
        return (window.innerHeight - 2 * this.toolbarHeight()) ?? 0;
    }

    containerStyle(transform: string): CSSProperties {
        return {
            height: "100%",
            width: "100%",
            position: "fixed",
            top: "0",
            left: "0",
            zIndex: 5000,
            transform: transform
        };
    }

    barStyle() {
        return {
            display: "flex",
            width: "100%",
            height: this.toolbarHeight() + "px",
            backgroundColor: Styles.colors.scanbot,

        }
    }

    barText(): CSSProperties {
        return {
            lineHeight: this.toolbarHeight() + "px",
            color: "white",
            position: "absolute",
            textAlign: "center",
            width: "100%",
            height: "100%"
        }
    }

    onAnimationStart() {

    }
    onAnimationEnd() {
        if (this.state.animation.type === AnimationType.Pop) {
            this.updateAnimationType(AnimationType.None);
        }
    }

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
                <div style={this.barStyle()} ref={ref => this.navigation = ref as HTMLDivElement}>
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

    pushType?: AnimationType;
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

    updateAnimationType(type: AnimationType, callback?: any) {
        this.setState({animation: {type: type}}, callback);
    }

    animation(type: AnimationType) {
        const animate = keyframes`from {transform: ${this.from(type)};} to {transform: ${this.to(type)};}`;
        return styled.div`animation: ${animate} 0.5s;`;
    }

    from(type: AnimationType) {
        if (type === AnimationType.PushRight) {
            return this.translate("X", 100);
        }
        if (type === AnimationType.PushBottom) {
            return this.translate("Y", 100);
        }

        if (type === AnimationType.Pop) {
            const axis = (this.pushType === AnimationType.PushRight) ? "X" : "Y";
            return this.translate(axis, 0);
        }
    }

    to(type: AnimationType) {
        if (type === AnimationType.PushRight) {
            return this.translate("X", 0);
        }
        if (type === AnimationType.PushBottom) {
            return this.translate("Y", 0);
        }
        if (type === AnimationType.Pop) {
            const axis = (this.pushType === AnimationType.PushRight) ? "X" : "Y";
            return this.translate(axis, 100);
        }
    }

    translate(axis: "X" | "Y", percentage: number) {
        return "translate" + axis + "(" + percentage + "%)";
    }
}
