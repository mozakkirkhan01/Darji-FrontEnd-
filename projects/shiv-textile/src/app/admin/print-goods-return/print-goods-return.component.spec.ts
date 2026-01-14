import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintGoodsReturnComponent } from './print-goods-return.component';

describe('PrintGoodsReturnComponent', () => {
  let component: PrintGoodsReturnComponent;
  let fixture: ComponentFixture<PrintGoodsReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintGoodsReturnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintGoodsReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
