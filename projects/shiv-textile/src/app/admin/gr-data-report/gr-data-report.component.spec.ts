import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrDataReportComponent } from './gr-data-report.component';

describe('GrDataReportComponent', () => {
  let component: GrDataReportComponent;
  let fixture: ComponentFixture<GrDataReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrDataReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrDataReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
