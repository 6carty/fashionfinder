import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MilestoneTypeService } from '../service/milestone-type.service';

import { MilestoneTypeComponent } from './milestone-type.component';

describe('MilestoneType Management Component', () => {
  let comp: MilestoneTypeComponent;
  let fixture: ComponentFixture<MilestoneTypeComponent>;
  let service: MilestoneTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'milestone-type', component: MilestoneTypeComponent }]), HttpClientTestingModule],
      declarations: [MilestoneTypeComponent],
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
      .overrideTemplate(MilestoneTypeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MilestoneTypeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MilestoneTypeService);

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
    expect(comp.milestoneTypes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to milestoneTypeService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMilestoneTypeIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMilestoneTypeIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
