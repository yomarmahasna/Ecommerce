import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesoverviewComponent } from './categoriesoverview.component';

describe('CategoriesoverviewComponent', () => {
  let component: CategoriesoverviewComponent;
  let fixture: ComponentFixture<CategoriesoverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesoverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoriesoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
