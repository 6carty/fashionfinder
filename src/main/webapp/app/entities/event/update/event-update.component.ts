import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { EventFormService, EventFormGroup } from './event-form.service';
import { IEvent } from '../event.model';
import { EventService } from '../service/event.service';
import { IOutfit } from 'app/entities/outfit/outfit.model';
import { OutfitService } from 'app/entities/outfit/service/outfit.service';

@Component({
  selector: 'jhi-event-update',
  templateUrl: './event-update.component.html',
})
export class EventUpdateComponent implements OnInit {
  isSaving = false;
  event: IEvent | null = null;

  outfitsSharedCollection: IOutfit[] = [];

  editForm: EventFormGroup = this.eventFormService.createEventFormGroup();

  constructor(
    protected eventService: EventService,
    protected eventFormService: EventFormService,
    protected outfitService: OutfitService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareOutfit = (o1: IOutfit | null, o2: IOutfit | null): boolean => this.outfitService.compareOutfit(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ event }) => {
      this.event = event;
      if (event) {
        this.updateForm(event);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const event = this.eventFormService.getEvent(this.editForm);
    if (event.id !== null) {
      this.subscribeToSaveResponse(this.eventService.update(event));
    } else {
      this.subscribeToSaveResponse(this.eventService.create(event));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEvent>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(event: IEvent): void {
    this.event = event;
    this.eventFormService.resetForm(this.editForm, event);

    this.outfitsSharedCollection = this.outfitService.addOutfitToCollectionIfMissing<IOutfit>(this.outfitsSharedCollection, event.outfit);
  }

  protected loadRelationshipsOptions(): void {
    this.outfitService
      .query()
      .pipe(map((res: HttpResponse<IOutfit[]>) => res.body ?? []))
      .pipe(map((outfits: IOutfit[]) => this.outfitService.addOutfitToCollectionIfMissing<IOutfit>(outfits, this.event?.outfit)))
      .subscribe((outfits: IOutfit[]) => (this.outfitsSharedCollection = outfits));
  }
}
