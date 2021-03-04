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
                type: AnimationType.Push
            },
            position: {
                from: undefined,
                to: undefined
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

    async componentDidMount(): Promise<void> {
        await ScanbotSdkService.instance.createDocumentScanner(this.props.onDocumentDetected);

        const element = document.getElementById('lol') as HTMLElement;
        console.log(element);
        element.addEventListener('animationend', () => {
            console.log("finito!");
            // Do anything here like remove the node when animation completes or something else!
        });

        element.addEventListener('animate', () => {
            console.log("progress!");
            // Do anything here like remove the node when animation completes or something else!
        });
    }

    componentWillUnmount(): void {
        ScanbotSdkService.instance.disposeDocumentScanner()
    }

    render() {

        const Animation = this.animation(this.state.animation.type);
        return (
            <Animation id={"lol"} style={{height: "100%", width: "100%", position: "fixed", top: "0", left: "0", zIndex: 5000}}>
                <div style={this.barStyle()} ref={ref => this.navigation = ref as HTMLDivElement}>
                    <button
                        style={Styles.backButton}
                        onClick={() => {
                            console.log("backpresserino");
                            this.setState({animation: {type: AnimationType.Pop}}, () => {
                                console.log("done!");
                                // this.setState({animation: {type: AnimationType.None}});
                            });
                        }}
                        dangerouslySetInnerHTML={{__html: "&#8249"}}
                    />
                    <div style={this.barText()}>
                        {"Document Scanner"}
                    </div>

                </div>
                <div style={{height: this.containerHeight(), backgroundColor: "black"}}>
                    <div id={ScanbotSdkService.DOCUMENT_SCANNER_CONTAINER} style={{width: "100%", height: "100%"}}/>
                </div>
                <div style={this.barStyle()} />
            </Animation>
        );
    }

    animation(type: AnimationType) {

        console.log(type);
        const from = (type == AnimationType.Push) ? "100%" : "0%";
        const to = (type == AnimationType.Push) ? "0%" : "100%";

        const animate = keyframes`
            from {transform: translateX(${this.from(type)}); } 
            to   {transform: translateX(${this.to(type)}); }
        `;
        // this.setState({position: {from: to, to: to}});
        return styled.div`animation: ${animate} 1s;`;
    }

    from(type: AnimationType) {
        if (type === AnimationType.Push) {
            return "100%";
        }
        if (type === AnimationType.Pop) {
            return "0%";
        }

        return this.state.animation.type;
    }

    to(type: AnimationType) {
        if (type === AnimationType.Push) {
            return "0%";
        }
        if (type === AnimationType.Pop) {
            return "100%";
        }

        return this.state.animation.type;
    }
}
