import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBarcodeComponent } from './product-barcode.component';

describe('ProductBarcodeComponent', () => {
  let component: ProductBarcodeComponent;
  let fixture: ComponentFixture<ProductBarcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductBarcodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
