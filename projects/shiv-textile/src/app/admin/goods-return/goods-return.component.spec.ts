import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsReturnComponent } from './goods-return.component';

describe('GoodsReturnComponent', () => {
  let component: GoodsReturnComponent;
  let fixture: ComponentFixture<GoodsReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoodsReturnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoodsReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
