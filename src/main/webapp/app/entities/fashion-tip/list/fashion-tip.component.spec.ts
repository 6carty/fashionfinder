import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FashionTipService } from '../service/fashion-tip.service';

import { FashionTipComponent } from './fashion-tip.component';

describe('FashionTip Management Component', () => {
  let comp: FashionTipComponent;
  let fixture: ComponentFixture<FashionTipComponent>;
  let service: FashionTipService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'fashion-tip', component: FashionTipComponent }]), HttpClientTestingModule],
      declarations: [FashionTipComponent],
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
      .overrideTemplate(FashionTipComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FashionTipComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FashionTipService);

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
    expect(comp.fashionTips?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to fashionTipService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getFashionTipIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getFashionTipIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
