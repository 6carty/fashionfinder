import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { WeatherDetailComponent } from './weather-detail.component';

describe('Weather Management Detail Component', () => {
  let comp: WeatherDetailComponent;
  let fixture: ComponentFixture<WeatherDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeatherDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ weather: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(WeatherDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(WeatherDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load weather on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.weather).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
