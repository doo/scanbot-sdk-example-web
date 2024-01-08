import React, { CSSProperties } from "react";
import styled, { keyframes } from "styled-components";
import { AnimationType } from "../enum/animation-type";
import ActionBarBottom from "./action-bar-bottom";
import ActionBarTop from "./action-bar-top";
import { Constants } from "../model/constants";
import { IScannerCommon } from "scanbot-web-sdk/@types/interfaces/i-scanner-common-handle";

export default class BaseScannerComponent extends React.Component<any, any> {
  // We need to make sure that the DOM element in which the scanner is rendered stays the same, even after re-rendering.
  // We do this by manually appending the scannerDiv to the current version of the scannerDivContainer after every render.
  private scannerDiv = (() => {
    const div = document.createElement("div");
    div.style.width = "100%";
    div.style.height = "100%";
    return div;
  })();

  private scannerDivContainer = React.createRef<HTMLDivElement>();

  constructor(props: any, scannerId: string) {
    super(props);

    this.state = {
      animation: {
        type: AnimationType.PushRight,
      }
    };
    this.scannerDiv.id = scannerId;
  }

  componentDidMount() {
    this.scannerDivContainer.current?.appendChild(this.scannerDiv);
  }

  componentDidUpdate() {
    this.scannerDivContainer.current?.appendChild(this.scannerDiv);
  }

  containerHeight() {
    const barHeight = (this.props.showBottomActionBar ? 2 : 1) * Constants.ACTION_BAR_HEIGHT ?? 0;
    return window.innerHeight - barHeight;
  }

  containerStyle(transform: string): CSSProperties {
    return {
      height: "100%",
      width: "100%",
      position: "fixed",
      top: "0",
      left: "0",
      zIndex: 20,
      transform: transform,
    };
  }

  previousDestination?: string;

  protected async onCameraSwap(scanner: IScannerCommon, force: boolean) {
    alert(`Swapping front/rear camera`);
    scanner?.swapCameraFacing(true);
  }

  protected async onCameraSwitch(scanner: IScannerCommon) {
    const cameras = await scanner?.fetchAvailableCameras()
    if (cameras) {
      const currentCameraInfo = scanner?.getActiveCameraInfo();
      if (currentCameraInfo) {
        const cameraIndex = cameras.findIndex((cameraInfo) => { return cameraInfo.deviceId === currentCameraInfo.deviceId });
        const newCameraIndex = (cameraIndex + 1) % (cameras.length);
        alert(`Current camera: ${currentCameraInfo.label}.\nSwitching to: ${cameras[newCameraIndex].label}`)
        scanner?.switchCamera(cameras[newCameraIndex].deviceId, false);
      }
    }
  }

  controller(title: string, labelText: string, onCameraSwap?: Function, onCameraSwitch?: Function) {
    const Animation = this.animation(this.state.animation.type);
    const destination = this.to(this.state.animation.type);
    this.previousDestination = destination;

    return (
      <Animation
        style={this.containerStyle(`${destination}`)}
        onAnimationEnd={this.onAnimationEnd.bind(this)}
      >
        <ActionBarTop
          title={title}
          onBack={() => {
            this.close();
          }}
          onCameraSwap={this.props.hideCameraSwapButtons ? undefined : onCameraSwap}
          onCameraSwitch={this.props.hideCameraSwapButtons ? undefined : onCameraSwitch}
        />
        <div
          style={{height: this.containerHeight(), backgroundColor: "black"}}
          ref={this.scannerDivContainer}
        />
        {this.props.showBottomActionBar && <ActionBarBottom
            label={labelText}
            onDone={this.onDonePress.bind(this)}
        />}
      </Animation>
    );
  }

  onDonePress() {
    this.close();
  }

  onScannerError(e: Error) {
    console.log(e.name + ': ' + e.message);
    alert(e.name + ': ' + e.message);
    this.close();
  }

  close() {
    this.updateAnimationType(AnimationType.Pop);
  }

  onAnimationEnd() {
    if (this.state.animation.type === AnimationType.Pop) {
      this.props.onClose();
    }
  }

  pushType?: AnimationType;

  updateAnimationType(type: AnimationType, callback?: any) {
    this.setState({ animation: { type: type } }, callback);
  }

  animation(type: AnimationType) {
    let from = this.from(type);
    let to = this.to(type);

    // Failsafe to prevent issues with re-render. If implemented correctly, should never enter this case
    if (this.previousDestination === to) {
      from = this.previousDestination;
      to = this.previousDestination;
    }
    const animate = keyframes`from {transform: ${from};} to {transform: ${to};}`;
    return styled.div`
      animation: ${animate} 0.5s;
    `;
  }

  from(type: AnimationType) {
    if (type === AnimationType.PushRight) {
      return this.translate("X", 100);
    }
    if (type === AnimationType.PushBottom) {
      return this.translate("Y", 100);
    }

    if (type === AnimationType.Pop) {
      const axis = this.pushType === AnimationType.PushRight ? "X" : "Y";
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
      const axis = this.pushType === AnimationType.PushRight ? "X" : "Y";
      return this.translate(axis, 100);
    }
  }

  translate(axis: "X" | "Y", percentage: number) {
    return "translate" + axis + "(" + percentage + "%)";
  }
}
