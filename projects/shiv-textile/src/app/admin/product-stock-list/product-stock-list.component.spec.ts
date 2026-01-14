import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStockListComponent } from './product-stock-list.component';

describe('ProductStockListComponent', () => {
  let component: ProductStockListComponent;
  let fixture: ComponentFixture<ProductStockListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductStockListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductStockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
