import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MrzScannerComponent } from "./mrz-scanner.component";

describe("MrzScannerComponent", () => {
  let component: MrzScannerComponent;
  let fixture: ComponentFixture<MrzScannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MrzScannerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrzScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
