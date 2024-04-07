import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutfitEditComponent } from './outfit-edit.component';

describe('OutfitEditComponent', () => {
  let component: OutfitEditComponent;
  let fixture: ComponentFixture<OutfitEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutfitEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OutfitEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
