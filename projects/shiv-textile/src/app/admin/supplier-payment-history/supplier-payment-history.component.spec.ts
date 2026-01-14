import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPaymentHistoryComponent } from './supplier-payment-history.component';

describe('SupplierPaymentHistoryComponent', () => {
  let component: SupplierPaymentHistoryComponent;
  let fixture: ComponentFixture<SupplierPaymentHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierPaymentHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierPaymentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
