import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodePrintbyInvoiceComponent } from './barcode-printby-invoice.component';

describe('BarcodePrintbyInvoiceComponent', () => {
  let component: BarcodePrintbyInvoiceComponent;
  let fixture: ComponentFixture<BarcodePrintbyInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarcodePrintbyInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarcodePrintbyInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
