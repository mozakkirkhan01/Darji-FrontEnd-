import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectSellListComponent } from './direct-sell-list.component';

describe('DirectSellListComponent', () => {
  let component: DirectSellListComponent;
  let fixture: ComponentFixture<DirectSellListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectSellListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectSellListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
