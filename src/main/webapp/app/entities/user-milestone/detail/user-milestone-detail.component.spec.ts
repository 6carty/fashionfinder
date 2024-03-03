import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserMilestoneDetailComponent } from './user-milestone-detail.component';

describe('UserMilestone Management Detail Component', () => {
  let comp: UserMilestoneDetailComponent;
  let fixture: ComponentFixture<UserMilestoneDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserMilestoneDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userMilestone: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UserMilestoneDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserMilestoneDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userMilestone on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userMilestone).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
