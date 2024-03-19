import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { OutfitPicFormService, OutfitPicFormGroup } from './outfit-pic-form.service';
import { IOutfitPic } from '../outfit-pic.model';
import { OutfitPicService } from '../service/outfit-pic.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IOutfit } from 'app/entities/outfit/outfit.model';
import { OutfitService } from 'app/entities/outfit/service/outfit.service';

@Component({
  selector: 'jhi-outfit-pic-update',
  templateUrl: './outfit-pic-update.component.html',
})
export class OutfitPicUpdateComponent implements OnInit {
  isSaving = false;
  outfitPic: IOutfitPic | null = null;

  outfitsSharedCollection: IOutfit[] = [];

  editForm: OutfitPicFormGroup = this.outfitPicFormService.createOutfitPicFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected outfitPicService: OutfitPicService,
    protected outfitPicFormService: OutfitPicFormService,
    protected outfitService: OutfitService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareOutfit = (o1: IOutfit | null, o2: IOutfit | null): boolean => this.outfitService.compareOutfit(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ outfitPic }) => {
      this.outfitPic = outfitPic;
      if (outfitPic) {
        this.updateForm(outfitPic);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('teamprojectApp.error', { message: err.message })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const outfitPic = this.outfitPicFormService.getOutfitPic(this.editForm);
    if (outfitPic.id !== null) {
      this.subscribeToSaveResponse(this.outfitPicService.update(outfitPic));
    } else {
      this.subscribeToSaveResponse(this.outfitPicService.create(outfitPic));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOutfitPic>>): void {
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

  protected updateForm(outfitPic: IOutfitPic): void {
    this.outfitPic = outfitPic;
    this.outfitPicFormService.resetForm(this.editForm, outfitPic);

    this.outfitsSharedCollection = this.outfitService.addOutfitToCollectionIfMissing<IOutfit>(
      this.outfitsSharedCollection,
      outfitPic.outfit
    );
  }

  protected loadRelationshipsOptions(): void {
    this.outfitService
      .query()
      .pipe(map((res: HttpResponse<IOutfit[]>) => res.body ?? []))
      .pipe(map((outfits: IOutfit[]) => this.outfitService.addOutfitToCollectionIfMissing<IOutfit>(outfits, this.outfitPic?.outfit)))
      .subscribe((outfits: IOutfit[]) => (this.outfitsSharedCollection = outfits));
  }
}
