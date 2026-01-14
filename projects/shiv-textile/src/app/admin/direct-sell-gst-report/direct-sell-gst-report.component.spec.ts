import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectSellGstReportComponent } from './direct-sell-gst-report.component';

describe('DirectSellGstReportComponent', () => {
  let component: DirectSellGstReportComponent;
  let fixture: ComponentFixture<DirectSellGstReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectSellGstReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectSellGstReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
