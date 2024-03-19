import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ClothingPicService } from '../service/clothing-pic.service';

import { ClothingPicComponent } from './clothing-pic.component';

describe('ClothingPic Management Component', () => {
  let comp: ClothingPicComponent;
  let fixture: ComponentFixture<ClothingPicComponent>;
  let service: ClothingPicService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'clothing-pic', component: ClothingPicComponent }]), HttpClientTestingModule],
      declarations: [ClothingPicComponent],
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
      .overrideTemplate(ClothingPicComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClothingPicComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ClothingPicService);

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
    expect(comp.clothingPics?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to clothingPicService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getClothingPicIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getClothingPicIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
