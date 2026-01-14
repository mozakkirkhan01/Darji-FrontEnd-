import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellGstReportComponent } from './sell-gst-report.component';

describe('SellGstReportComponent', () => {
  let component: SellGstReportComponent;
  let fixture: ComponentFixture<SellGstReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellGstReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellGstReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
