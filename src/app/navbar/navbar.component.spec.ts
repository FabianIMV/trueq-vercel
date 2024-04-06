import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NAVBARComponent } from './navbar.component';

describe('NAVBARComponent', () => {
  let component: NAVBARComponent;
  let fixture: ComponentFixture<NAVBARComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NAVBARComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NAVBARComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
