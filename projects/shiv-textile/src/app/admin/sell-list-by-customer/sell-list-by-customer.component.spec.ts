import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellListByCustomerComponent } from './sell-list-by-customer.component';

describe('SellListByCustomerComponent', () => {
  let component: SellListByCustomerComponent;
  let fixture: ComponentFixture<SellListByCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellListByCustomerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellListByCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
