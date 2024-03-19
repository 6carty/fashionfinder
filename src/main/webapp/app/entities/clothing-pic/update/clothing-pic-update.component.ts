import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ClothingPicFormService, ClothingPicFormGroup } from './clothing-pic-form.service';
import { IClothingPic } from '../clothing-pic.model';
import { ClothingPicService } from '../service/clothing-pic.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IClothingItem } from 'app/entities/clothing-item/clothing-item.model';
import { ClothingItemService } from 'app/entities/clothing-item/service/clothing-item.service';

@Component({
  selector: 'jhi-clothing-pic-update',
  templateUrl: './clothing-pic-update.component.html',
})
export class ClothingPicUpdateComponent implements OnInit {
  isSaving = false;
  clothingPic: IClothingPic | null = null;

  clothingItemsSharedCollection: IClothingItem[] = [];

  editForm: ClothingPicFormGroup = this.clothingPicFormService.createClothingPicFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected clothingPicService: ClothingPicService,
    protected clothingPicFormService: ClothingPicFormService,
    protected clothingItemService: ClothingItemService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareClothingItem = (o1: IClothingItem | null, o2: IClothingItem | null): boolean =>
    this.clothingItemService.compareClothingItem(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clothingPic }) => {
      this.clothingPic = clothingPic;
      if (clothingPic) {
        this.updateForm(clothingPic);
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
    const clothingPic = this.clothingPicFormService.getClothingPic(this.editForm);
    if (clothingPic.id !== null) {
      this.subscribeToSaveResponse(this.clothingPicService.update(clothingPic));
    } else {
      this.subscribeToSaveResponse(this.clothingPicService.create(clothingPic));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClothingPic>>): void {
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

  protected updateForm(clothingPic: IClothingPic): void {
    this.clothingPic = clothingPic;
    this.clothingPicFormService.resetForm(this.editForm, clothingPic);

    this.clothingItemsSharedCollection = this.clothingItemService.addClothingItemToCollectionIfMissing<IClothingItem>(
      this.clothingItemsSharedCollection,
      clothingPic.clothingItem
    );
  }

  protected loadRelationshipsOptions(): void {
    this.clothingItemService
      .query()
      .pipe(map((res: HttpResponse<IClothingItem[]>) => res.body ?? []))
      .pipe(
        map((clothingItems: IClothingItem[]) =>
          this.clothingItemService.addClothingItemToCollectionIfMissing<IClothingItem>(clothingItems, this.clothingPic?.clothingItem)
        )
      )
      .subscribe((clothingItems: IClothingItem[]) => (this.clothingItemsSharedCollection = clothingItems));
  }
}
