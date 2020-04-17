import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GoalsGraphsComponent} from './goals-graphs.component';

describe('GoalsGraphsComponent', () => {
  let component: GoalsGraphsComponent;
  let fixture: ComponentFixture<GoalsGraphsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GoalsGraphsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalsGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
