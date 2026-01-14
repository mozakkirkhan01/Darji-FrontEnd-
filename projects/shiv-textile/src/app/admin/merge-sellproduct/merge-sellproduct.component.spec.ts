import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeSellproductComponent } from './merge-sellproduct.component';

describe('MergeSellproductComponent', () => {
  let component: MergeSellproductComponent;
  let fixture: ComponentFixture<MergeSellproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergeSellproductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MergeSellproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
