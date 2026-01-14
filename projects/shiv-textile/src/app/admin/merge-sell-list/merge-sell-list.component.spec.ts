import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeSellListComponent } from './merge-sell-list.component';

describe('MergeSellListComponent', () => {
  let component: MergeSellListComponent;
  let fixture: ComponentFixture<MergeSellListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergeSellListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MergeSellListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
