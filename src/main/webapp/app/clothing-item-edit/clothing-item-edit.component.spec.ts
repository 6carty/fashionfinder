import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClothingItemEditComponent } from './clothing-item-edit.component';

describe('ClothingItemEditComponent', () => {
  let component: ClothingItemEditComponent;
  let fixture: ComponentFixture<ClothingItemEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClothingItemEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClothingItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
