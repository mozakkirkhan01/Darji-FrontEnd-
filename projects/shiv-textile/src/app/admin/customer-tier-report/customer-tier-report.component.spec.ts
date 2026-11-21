import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTierReportComponent } from './customer-tier-report.component';

describe('CustomerTierReportComponent', () => {
  let component: CustomerTierReportComponent;
  let fixture: ComponentFixture<CustomerTierReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerTierReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerTierReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
