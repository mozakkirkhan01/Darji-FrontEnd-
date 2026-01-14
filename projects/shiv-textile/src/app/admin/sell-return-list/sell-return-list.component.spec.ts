import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellReturnListComponent } from './sell-return-list.component';

describe('SellReturnListComponent', () => {
  let component: SellReturnListComponent;
  let fixture: ComponentFixture<SellReturnListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellReturnListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellReturnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
