import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ClothingItemService } from '../service/clothing-item.service';

import { ClothingItemComponent } from './clothing-item.component';

describe('ClothingItem Management Component', () => {
  let comp: ClothingItemComponent;
  let fixture: ComponentFixture<ClothingItemComponent>;
  let service: ClothingItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'clothing-item', component: ClothingItemComponent }]), HttpClientTestingModule],
      declarations: [ClothingItemComponent],
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
      .overrideTemplate(ClothingItemComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClothingItemComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ClothingItemService);

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
    expect(comp.clothingItems?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to clothingItemService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getClothingItemIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getClothingItemIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
