import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarCodePrintComponent } from './bar-code-print.component';

describe('BarCodePrintComponent', () => {
  let component: BarCodePrintComponent;
  let fixture: ComponentFixture<BarCodePrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarCodePrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarCodePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
