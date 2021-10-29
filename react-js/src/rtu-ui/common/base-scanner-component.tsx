import React, { CSSProperties } from "react";
import styled, { keyframes } from "styled-components";
import { AnimationType } from "../enum/animation-type";
import ActionBarBottom from "./action-bar-bottom";
import ActionBarTop from "./action-bar-top";
import { Constants } from "../model/constants";

export default class BaseScannerComponent extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      animation: {
        type: AnimationType.None,
      },
    };
  }

  containerHeight() {
    return window.innerHeight - 2 * Constants.ACTION_BAR_HEIGHT ?? 0;
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

  controller(scannerId: string, title: string, labelText: string) {
    if (this.state.animation.type === AnimationType.None) {
      return null;
    }
    const Animation = this.animation(this.state.animation.type);
    const destination = this.to(this.state.animation.type);
    this.previousDestination = destination;

    return (
      <Animation
        style={this.containerStyle(`${destination}`)}
        onAnimationStart={this.onAnimationStart.bind(this)}
        onAnimationEnd={this.onAnimationEnd.bind(this)}
      >
        <ActionBarTop
          title={title}
          onBack={() => {
            this.pop();
          }}
        />
        <div
          style={{ height: this.containerHeight(), backgroundColor: "black" }}
        >
          <div id={scannerId} style={{ width: "100%", height: "100%" }} />
        </div>
        <ActionBarBottom
          label={labelText}
          onDone={this.onDonePress.bind(this)}
        />
      </Animation>
    );
  }

  onDonePress() {
    this.pop();
  }

  private _isVisible: boolean = false;
  isVisible() {
    return this._isVisible;
  }
  push(type: AnimationType) {
    this._isVisible = true;
  }

  pop() {
    this._isVisible = false;
  }

  onAnimationStart() {}

  onAnimationEnd() {
    if (this.state.animation.type === AnimationType.Pop) {
      this.updateAnimationType(AnimationType.None);
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
