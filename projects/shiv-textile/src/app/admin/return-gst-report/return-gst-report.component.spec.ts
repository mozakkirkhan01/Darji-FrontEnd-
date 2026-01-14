import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnGstReportComponent } from './return-gst-report.component';

describe('ReturnGstReportComponent', () => {
  let component: ReturnGstReportComponent;
  let fixture: ComponentFixture<ReturnGstReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnGstReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnGstReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
