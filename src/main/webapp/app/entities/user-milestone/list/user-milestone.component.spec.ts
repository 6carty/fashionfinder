import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserMilestoneService } from '../service/user-milestone.service';

import { UserMilestoneComponent } from './user-milestone.component';

describe('UserMilestone Management Component', () => {
  let comp: UserMilestoneComponent;
  let fixture: ComponentFixture<UserMilestoneComponent>;
  let service: UserMilestoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'user-milestone', component: UserMilestoneComponent }]), HttpClientTestingModule],
      declarations: [UserMilestoneComponent],
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
      .overrideTemplate(UserMilestoneComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserMilestoneComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserMilestoneService);

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
    expect(comp.userMilestones?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to userMilestoneService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getUserMilestoneIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getUserMilestoneIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
