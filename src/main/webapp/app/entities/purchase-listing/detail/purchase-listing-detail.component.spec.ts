import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PurchaseListingDetailComponent } from './purchase-listing-detail.component';

describe('PurchaseListing Management Detail Component', () => {
  let comp: PurchaseListingDetailComponent;
  let fixture: ComponentFixture<PurchaseListingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseListingDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ purchaseListing: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PurchaseListingDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PurchaseListingDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load purchaseListing on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.purchaseListing).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
