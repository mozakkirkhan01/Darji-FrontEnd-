import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailysellListComponent } from './dailysell-list.component';

describe('DailysellListComponent', () => {
  let component: DailysellListComponent;
  let fixture: ComponentFixture<DailysellListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailysellListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailysellListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
