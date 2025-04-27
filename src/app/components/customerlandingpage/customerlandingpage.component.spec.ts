import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerlandingpageComponent } from './customerlandingpage.component';

describe('CustomerlandingpageComponent', () => {
  let component: CustomerlandingpageComponent;
  let fixture: ComponentFixture<CustomerlandingpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerlandingpageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerlandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
