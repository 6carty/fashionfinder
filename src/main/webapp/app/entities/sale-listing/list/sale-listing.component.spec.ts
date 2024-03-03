import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SaleListingService } from '../service/sale-listing.service';

import { SaleListingComponent } from './sale-listing.component';

describe('SaleListing Management Component', () => {
  let comp: SaleListingComponent;
  let fixture: ComponentFixture<SaleListingComponent>;
  let service: SaleListingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'sale-listing', component: SaleListingComponent }]), HttpClientTestingModule],
      declarations: [SaleListingComponent],
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
      .overrideTemplate(SaleListingComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SaleListingComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SaleListingService);

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
    expect(comp.saleListings?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to saleListingService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getSaleListingIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSaleListingIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
