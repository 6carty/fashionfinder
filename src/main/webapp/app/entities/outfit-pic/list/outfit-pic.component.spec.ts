import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { OutfitPicService } from '../service/outfit-pic.service';

import { OutfitPicComponent } from './outfit-pic.component';

describe('OutfitPic Management Component', () => {
  let comp: OutfitPicComponent;
  let fixture: ComponentFixture<OutfitPicComponent>;
  let service: OutfitPicService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'outfit-pic', component: OutfitPicComponent }]), HttpClientTestingModule],
      declarations: [OutfitPicComponent],
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
      .overrideTemplate(OutfitPicComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OutfitPicComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OutfitPicService);

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
    expect(comp.outfitPics?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to outfitPicService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getOutfitPicIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getOutfitPicIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
