import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellDaybookComponent } from './sell-daybook.component';

describe('SellDaybookComponent', () => {
  let component: SellDaybookComponent;
  let fixture: ComponentFixture<SellDaybookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellDaybookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellDaybookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
