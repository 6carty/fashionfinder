import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PurchaseListingService } from '../service/purchase-listing.service';

import { PurchaseListingComponent } from './purchase-listing.component';

describe('PurchaseListing Management Component', () => {
  let comp: PurchaseListingComponent;
  let fixture: ComponentFixture<PurchaseListingComponent>;
  let service: PurchaseListingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'purchase-listing', component: PurchaseListingComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [PurchaseListingComponent],
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
      .overrideTemplate(PurchaseListingComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PurchaseListingComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PurchaseListingService);

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
    expect(comp.purchaseListings?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to purchaseListingService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPurchaseListingIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPurchaseListingIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
