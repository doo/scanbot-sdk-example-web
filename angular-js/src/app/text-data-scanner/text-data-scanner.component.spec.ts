import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TextDataScannerComponent } from "./text-data-scanner.component";

describe("TextDataScannerComponent", () => {
  let component: TextDataScannerComponent;
  let fixture: ComponentFixture<TextDataScannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextDataScannerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextDataScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
