import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Wip2Component } from './wip2.component';

describe('Wip2Component', () => {
  let component: Wip2Component;
  let fixture: ComponentFixture<Wip2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Wip2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Wip2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
