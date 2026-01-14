import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferProductToSVComponent } from './transfer-product-to-sv.component';

describe('TransferProductToSVComponent', () => {
  let component: TransferProductToSVComponent;
  let fixture: ComponentFixture<TransferProductToSVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferProductToSVComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferProductToSVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
