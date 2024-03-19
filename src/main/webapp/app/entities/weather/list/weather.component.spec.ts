import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { WeatherService } from '../service/weather.service';

import { WeatherComponent } from './weather.component';

describe('Weather Management Component', () => {
  let comp: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;
  let service: WeatherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'weather', component: WeatherComponent }]), HttpClientTestingModule],
      declarations: [WeatherComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(WeatherComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WeatherComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(WeatherService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.weathers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to weatherService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getWeatherIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getWeatherIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
