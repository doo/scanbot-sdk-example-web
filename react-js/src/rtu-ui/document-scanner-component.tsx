import React, {CSSProperties} from "react";
import styled, {keyframes} from "styled-components";
import {ScanbotSdkService} from "../service/scanbot-sdk-service";
import {Styles} from "../model/styles";

export enum AnimationType {
    None,
    Push,
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
                style={{...this.containerStyle(), transform: `translateX(${this.to(this.state.animation.type)})`}}
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

    async push() {
        this.updateAnimationType(AnimationType.Push, async () => {
            await ScanbotSdkService.instance.createDocumentScanner(this.props.onDocumentDetected);
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
            from {transform: translateX(${this.from(type)}); } 
            to   {transform: translateX(${this.to(type)}); }
        `;
        return styled.div`animation: ${animate} 1s;`;
    }

    from(type: AnimationType) {
        if (type === AnimationType.Push) {
            return "100%";
        }
        if (type === AnimationType.Pop) {
            return "0%";
        }
    }

    to(type: AnimationType) {
        if (type === AnimationType.Push) {
            return "0%";
        }
        if (type === AnimationType.Pop) {
            return "100%";
        }
    }
}
