import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectSellReturnComponent } from './direct-sell-return.component';

describe('DirectSellReturnComponent', () => {
  let component: DirectSellReturnComponent;
  let fixture: ComponentFixture<DirectSellReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectSellReturnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectSellReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
