import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPaymentDetailComponent } from './supplier-payment-detail.component';

describe('SupplierPaymentDetailComponent', () => {
  let component: SupplierPaymentDetailComponent;
  let fixture: ComponentFixture<SupplierPaymentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierPaymentDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
