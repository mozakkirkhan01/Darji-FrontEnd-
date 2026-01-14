import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeReturnListComponent } from './merge-return-list.component';

describe('MergeReturnListComponent', () => {
  let component: MergeReturnListComponent;
  let fixture: ComponentFixture<MergeReturnListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergeReturnListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MergeReturnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
