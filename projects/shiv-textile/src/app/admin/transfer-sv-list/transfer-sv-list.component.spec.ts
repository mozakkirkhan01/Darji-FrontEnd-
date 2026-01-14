import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferSvListComponent } from './transfer-sv-list.component';

describe('TransferSvListComponent', () => {
  let component: TransferSvListComponent;
  let fixture: ComponentFixture<TransferSvListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferSvListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferSvListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
