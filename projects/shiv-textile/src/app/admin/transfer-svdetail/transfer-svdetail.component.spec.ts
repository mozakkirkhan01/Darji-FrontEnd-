import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferSVDetailComponent } from './transfer-svdetail.component';

describe('TransferSVDetailComponent', () => {
  let component: TransferSVDetailComponent;
  let fixture: ComponentFixture<TransferSVDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferSVDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferSVDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
