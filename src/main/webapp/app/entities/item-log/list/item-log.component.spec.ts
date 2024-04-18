import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ItemLogService } from '../service/item-log.service';

import { ItemLogComponent } from './item-log.component';

describe('ItemLog Management Component', () => {
  let comp: ItemLogComponent;
  let fixture: ComponentFixture<ItemLogComponent>;
  let service: ItemLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'item-log', component: ItemLogComponent }]),
        HttpClientTestingModule,
        ItemLogComponent,
      ],
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
      .overrideTemplate(ItemLogComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItemLogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ItemLogService);

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
    expect(comp.itemLogs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to itemLogService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getItemLogIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getItemLogIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
