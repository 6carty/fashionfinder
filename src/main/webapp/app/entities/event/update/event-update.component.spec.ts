import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EventFormService } from './event-form.service';
import { EventService } from '../service/event.service';
import { IEvent } from '../event.model';
import { IOutfit } from 'app/entities/outfit/outfit.model';
import { OutfitService } from 'app/entities/outfit/service/outfit.service';

import { EventUpdateComponent } from './event-update.component';

describe('Event Management Update Component', () => {
  let comp: EventUpdateComponent;
  let fixture: ComponentFixture<EventUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eventFormService: EventFormService;
  let eventService: EventService;
  let outfitService: OutfitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EventUpdateComponent],
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
      .overrideTemplate(EventUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventFormService = TestBed.inject(EventFormService);
    eventService = TestBed.inject(EventService);
    outfitService = TestBed.inject(OutfitService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Outfit query and add missing value', () => {
      const event: IEvent = { id: 456 };
      const outfit: IOutfit = { id: 1535 };
      event.outfit = outfit;

      const outfitCollection: IOutfit[] = [{ id: 42292 }];
      jest.spyOn(outfitService, 'query').mockReturnValue(of(new HttpResponse({ body: outfitCollection })));
      const additionalOutfits = [outfit];
      const expectedCollection: IOutfit[] = [...additionalOutfits, ...outfitCollection];
      jest.spyOn(outfitService, 'addOutfitToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ event });
      comp.ngOnInit();

      expect(outfitService.query).toHaveBeenCalled();
      expect(outfitService.addOutfitToCollectionIfMissing).toHaveBeenCalledWith(
        outfitCollection,
        ...additionalOutfits.map(expect.objectContaining)
      );
      expect(comp.outfitsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const event: IEvent = { id: 456 };
      const outfit: IOutfit = { id: 83700 };
      event.outfit = outfit;

      activatedRoute.data = of({ event });
      comp.ngOnInit();

      expect(comp.outfitsSharedCollection).toContain(outfit);
      expect(comp.event).toEqual(event);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEvent>>();
      const event = { id: 123 };
      jest.spyOn(eventFormService, 'getEvent').mockReturnValue(event);
      jest.spyOn(eventService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ event });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: event }));
      saveSubject.complete();

      // THEN
      expect(eventFormService.getEvent).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(eventService.update).toHaveBeenCalledWith(expect.objectContaining(event));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEvent>>();
      const event = { id: 123 };
      jest.spyOn(eventFormService, 'getEvent').mockReturnValue({ id: null });
      jest.spyOn(eventService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ event: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: event }));
      saveSubject.complete();

      // THEN
      expect(eventFormService.getEvent).toHaveBeenCalled();
      expect(eventService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEvent>>();
      const event = { id: 123 };
      jest.spyOn(eventService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ event });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(eventService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareOutfit', () => {
      it('Should forward to outfitService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(outfitService, 'compareOutfit');
        comp.compareOutfit(entity, entity2);
        expect(outfitService.compareOutfit).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
