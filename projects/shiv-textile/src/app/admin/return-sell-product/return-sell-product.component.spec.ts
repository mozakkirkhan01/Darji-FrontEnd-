import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnSellProductComponent } from './return-sell-product.component';

describe('ReturnSellProductComponent', () => {
  let component: ReturnSellProductComponent;
  let fixture: ComponentFixture<ReturnSellProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnSellProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnSellProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
