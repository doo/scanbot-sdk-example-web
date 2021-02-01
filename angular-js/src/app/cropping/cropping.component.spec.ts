import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CroppingComponent } from './cropping.component';

describe('CroppingComponent', () => {
  let component: CroppingComponent;
  let fixture: ComponentFixture<CroppingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CroppingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CroppingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
