import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FashionPlannerComponent } from './fashion-planner.component';

describe('FashionPlannerComponent', () => {
  let component: FashionPlannerComponent;
  let fixture: ComponentFixture<FashionPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FashionPlannerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FashionPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
