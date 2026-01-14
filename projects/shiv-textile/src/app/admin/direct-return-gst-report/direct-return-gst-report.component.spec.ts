import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectReturnGstReportComponent } from './direct-return-gst-report.component';

describe('DirectReturnGstReportComponent', () => {
  let component: DirectReturnGstReportComponent;
  let fixture: ComponentFixture<DirectReturnGstReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectReturnGstReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectReturnGstReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
