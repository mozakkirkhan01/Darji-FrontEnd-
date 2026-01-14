import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectSellComponent } from './direct-sell.component';

describe('DirectSellComponent', () => {
  let component: DirectSellComponent;
  let fixture: ComponentFixture<DirectSellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectSellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
