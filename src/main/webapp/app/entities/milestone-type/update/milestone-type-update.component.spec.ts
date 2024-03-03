import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MilestoneTypeFormService } from './milestone-type-form.service';
import { MilestoneTypeService } from '../service/milestone-type.service';
import { IMilestoneType } from '../milestone-type.model';

import { MilestoneTypeUpdateComponent } from './milestone-type-update.component';

describe('MilestoneType Management Update Component', () => {
  let comp: MilestoneTypeUpdateComponent;
  let fixture: ComponentFixture<MilestoneTypeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let milestoneTypeFormService: MilestoneTypeFormService;
  let milestoneTypeService: MilestoneTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MilestoneTypeUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(MilestoneTypeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MilestoneTypeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    milestoneTypeFormService = TestBed.inject(MilestoneTypeFormService);
    milestoneTypeService = TestBed.inject(MilestoneTypeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const milestoneType: IMilestoneType = { id: 456 };

      activatedRoute.data = of({ milestoneType });
      comp.ngOnInit();

      expect(comp.milestoneType).toEqual(milestoneType);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMilestoneType>>();
      const milestoneType = { id: 123 };
      jest.spyOn(milestoneTypeFormService, 'getMilestoneType').mockReturnValue(milestoneType);
      jest.spyOn(milestoneTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ milestoneType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: milestoneType }));
      saveSubject.complete();

      // THEN
      expect(milestoneTypeFormService.getMilestoneType).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(milestoneTypeService.update).toHaveBeenCalledWith(expect.objectContaining(milestoneType));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMilestoneType>>();
      const milestoneType = { id: 123 };
      jest.spyOn(milestoneTypeFormService, 'getMilestoneType').mockReturnValue({ id: null });
      jest.spyOn(milestoneTypeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ milestoneType: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: milestoneType }));
      saveSubject.complete();

      // THEN
      expect(milestoneTypeFormService.getMilestoneType).toHaveBeenCalled();
      expect(milestoneTypeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMilestoneType>>();
      const milestoneType = { id: 123 };
      jest.spyOn(milestoneTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ milestoneType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(milestoneTypeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
