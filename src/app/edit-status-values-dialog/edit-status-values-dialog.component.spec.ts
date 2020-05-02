import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditStatusValuesDialogComponent} from './edit-status-values-dialog.component';

describe('EditStatusValuesDialogComponent', () => {
  let component: EditStatusValuesDialogComponent;
  let fixture: ComponentFixture<EditStatusValuesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditStatusValuesDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStatusValuesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
