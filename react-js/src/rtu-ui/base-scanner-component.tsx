import React, {CSSProperties} from "react";
import styled, {keyframes} from "styled-components";
import {ScanbotSdkService} from "../service/scanbot-sdk-service";
import {Styles} from "../model/styles";
import {AnimationType} from "./enum/animation-type";

export default class BaseScannerComponent extends React.Component<any, any> {

    constructor(props: any) {
        super(props);

        this.state = {
            animation: {
                type: AnimationType.None
            }
        }
    }

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

    pushType?: AnimationType;

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
