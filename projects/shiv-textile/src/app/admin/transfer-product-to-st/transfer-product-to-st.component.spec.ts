import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferProductToSTComponent } from './transfer-product-to-st.component';

describe('TransferProductToSTComponent', () => {
  let component: TransferProductToSTComponent;
  let fixture: ComponentFixture<TransferProductToSTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferProductToSTComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferProductToSTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
