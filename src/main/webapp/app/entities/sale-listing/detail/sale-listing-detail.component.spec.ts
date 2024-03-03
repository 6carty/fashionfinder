import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SaleListingDetailComponent } from './sale-listing-detail.component';

describe('SaleListing Management Detail Component', () => {
  let comp: SaleListingDetailComponent;
  let fixture: ComponentFixture<SaleListingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleListingDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ saleListing: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SaleListingDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SaleListingDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load saleListing on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.saleListing).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
