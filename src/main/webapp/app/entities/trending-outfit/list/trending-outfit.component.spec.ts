import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TrendingOutfitService } from '../service/trending-outfit.service';

import { TrendingOutfitComponent } from './trending-outfit.component';

describe('TrendingOutfit Management Component', () => {
  let comp: TrendingOutfitComponent;
  let fixture: ComponentFixture<TrendingOutfitComponent>;
  let service: TrendingOutfitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'trending-outfit', component: TrendingOutfitComponent }]), HttpClientTestingModule],
      declarations: [TrendingOutfitComponent],
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
      .overrideTemplate(TrendingOutfitComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TrendingOutfitComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TrendingOutfitService);

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
    expect(comp.trendingOutfits?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to trendingOutfitService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getTrendingOutfitIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getTrendingOutfitIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
