import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { OutfitService } from '../service/outfit.service';

import { OutfitComponent } from './outfit.component';

describe('Outfit Management Component', () => {
  let comp: OutfitComponent;
  let fixture: ComponentFixture<OutfitComponent>;
  let service: OutfitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'outfit', component: OutfitComponent }]), HttpClientTestingModule],
      declarations: [OutfitComponent],
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
      .overrideTemplate(OutfitComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OutfitComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OutfitService);

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
    expect(comp.outfits?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to outfitService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getOutfitIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getOutfitIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
