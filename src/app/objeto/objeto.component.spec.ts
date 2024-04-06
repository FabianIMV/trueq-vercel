import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OBJETOComponent } from './objeto.component';

describe('OBJETOComponent', () => {
  let component: OBJETOComponent;
  let fixture: ComponentFixture<OBJETOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OBJETOComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OBJETOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
