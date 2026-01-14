import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyDirectSellReportComponent } from './daily-direct-sell-report.component';

describe('DailyDirectSellReportComponent', () => {
  let component: DailyDirectSellReportComponent;
  let fixture: ComponentFixture<DailyDirectSellReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyDirectSellReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyDirectSellReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
