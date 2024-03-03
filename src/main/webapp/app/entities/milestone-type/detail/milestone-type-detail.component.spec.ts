import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MilestoneTypeDetailComponent } from './milestone-type-detail.component';

describe('MilestoneType Management Detail Component', () => {
  let comp: MilestoneTypeDetailComponent;
  let fixture: ComponentFixture<MilestoneTypeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MilestoneTypeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ milestoneType: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MilestoneTypeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MilestoneTypeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load milestoneType on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.milestoneType).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
