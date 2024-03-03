import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ExchangeRequestDetailComponent } from './exchange-request-detail.component';

describe('ExchangeRequest Management Detail Component', () => {
  let comp: ExchangeRequestDetailComponent;
  let fixture: ComponentFixture<ExchangeRequestDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExchangeRequestDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ exchangeRequest: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ExchangeRequestDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ExchangeRequestDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load exchangeRequest on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.exchangeRequest).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
