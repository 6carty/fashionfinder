import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ExchangeRequestService } from '../service/exchange-request.service';

import { ExchangeRequestComponent } from './exchange-request.component';

describe('ExchangeRequest Management Component', () => {
  let comp: ExchangeRequestComponent;
  let fixture: ComponentFixture<ExchangeRequestComponent>;
  let service: ExchangeRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'exchange-request', component: ExchangeRequestComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [ExchangeRequestComponent],
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
      .overrideTemplate(ExchangeRequestComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExchangeRequestComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ExchangeRequestService);

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
    expect(comp.exchangeRequests?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to exchangeRequestService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getExchangeRequestIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getExchangeRequestIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
