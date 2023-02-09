import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NavigationUtils } from 'src/app/service/navigation-utils';
import { Location } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  location: Location;

  @Input() showBackButton: boolean;
  @Input() title: string;
  @Output() onBack: EventEmitter<any> = new EventEmitter();
  @Output() onCameraSwap?: EventEmitter<any> = new EventEmitter();
  @Output() onCameraSwitch?: EventEmitter<any> = new EventEmitter();

  constructor(
    location: Location
  ) {
    this.location = location;
  }

  async ngOnInit(): Promise<void> {
    this.backButtonShow(this.showBackButton === true);
    this.showCameraSwapButton(this.onCameraSwap != undefined);
    this.showCameraSwitchButton(this.onCameraSwitch != undefined);
  }

  private backButtonShow(show: boolean) {
    const backButtonDisplay = show
      ? "block"
      : "none";
    const toolbarDisplay = show
      ? "none"
      : "block";

    NavigationUtils.getElementById("back-button").style.display = backButtonDisplay;
    NavigationUtils.getElementById("toolbar-logo").style.display = toolbarDisplay;
  }

  private showCameraSwapButton(show: boolean) {
    NavigationUtils.getElementById("camera-swap-button").style.display = show
      ? "block"
      : "none";
  }

  private showCameraSwitchButton(show: boolean) {
    NavigationUtils.getElementById("camera-switch-button").style.display = show
      ? "block"
      : "none";
  }

  async onBackClicked() {
    if (this.onBack) {
      this.onBack.emit();
    } else {
      this.location.back();
    }
  }

  async onCameraSwapClicked() {
    if (this.onCameraSwap) {
      this.onCameraSwap.emit();
    }
  }

  async onCameraSwitchClicked() {
    if (this.onCameraSwitch) {
      this.onCameraSwitch.emit();
    }
  }
}
