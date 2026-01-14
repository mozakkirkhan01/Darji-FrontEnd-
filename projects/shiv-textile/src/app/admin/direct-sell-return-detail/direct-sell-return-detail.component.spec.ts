import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectSellReturnDetailComponent } from './direct-sell-return-detail.component';

describe('DirectSellReturnDetailComponent', () => {
  let component: DirectSellReturnDetailComponent;
  let fixture: ComponentFixture<DirectSellReturnDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectSellReturnDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectSellReturnDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
