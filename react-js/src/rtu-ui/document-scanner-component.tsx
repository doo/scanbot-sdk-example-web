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
        // return this.navigation?.clientHeight ?? 0;
    }
    containerHeight() {
        // return "104px";
        // if (!this.navigation) {
        //     return "100%";
        // }
        return (window.innerHeight - 2 * this.toolbarHeight()) ?? 0;
    }

    containerStyle(): CSSProperties {
        return {
            height: "100%",
            width: "100%",
            position: "fixed",
            top: "0",
            left: "0",
            zIndex: 5000
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

    render() {
        if (this.state.animation.type === AnimationType.None) {
            return null;
        }
        const Animation = this.animation(this.state.animation.type);
        return (
            <Animation
                id={"lol"}
                style={{...this.containerStyle(), transform: `${this.to(this.state.animation.type)}`}}
                onAnimationStart={() => {

                }} onAnimationEnd={() => {

            }}>
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
            ScanbotSdkService.instance.disposeDocumentScanner()
        });
    }

    updateAnimationType(type: AnimationType, callback?: any) {
        this.setState({animation: {type: type}}, callback);
    }

    animation(type: AnimationType) {
        const animate = keyframes`
            from {transform: ${this.from(type)}; } 
            to   {transform: ${this.to(type)}; }
        `;
        return styled.div`animation: ${animate} 0.5s;`;
    }

    from(type: AnimationType) {
        if (type === AnimationType.PushRight) {
            return "translateX(100%)";
        }
        if (type === AnimationType.PushBottom) {
            return "translateY(100%)";
        }

        if (type === AnimationType.Pop) {
            if (this.pushType === AnimationType.PushRight) {
                return "translateX(0%)";
            } else {
                return "translateY(0%)";
            }
        }
    }

    to(type: AnimationType) {
        if (type === AnimationType.PushRight) {
            return "translateX(0%)";
        }
        if (type === AnimationType.PushBottom) {
            return "translateY(0%)";
        }
        if (type === AnimationType.Pop) {
            if (this.pushType === AnimationType.PushRight) {
                return "translateX(100%)";
            } else {
                return "translateY(100%)";
            }
        }
    }
}
