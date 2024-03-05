import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherCComponent } from './weather-c.component';

describe('WeatherComponent', () => {
  let component: WeatherCComponent;
  let fixture: ComponentFixture<WeatherCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeatherCComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
