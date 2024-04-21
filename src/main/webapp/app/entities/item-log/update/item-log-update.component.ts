import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ItemLogFormService, ItemLogFormGroup } from './item-log-form.service';
import { IItemLog } from '../item-log.model';
import { ItemLogService } from '../service/item-log.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IOutfit } from 'app/entities/outfit/outfit.model';
import { OutfitService } from 'app/entities/outfit/service/outfit.service';

@Component({
  selector: 'jhi-item-log-update',
  templateUrl: './item-log-update.component.html',
})
export class ItemLogUpdateComponent implements OnInit {
  isSaving = false;
  itemLog: IItemLog | null = null;

  usersSharedCollection: IUser[] = [];
  outfitsSharedCollection: IOutfit[] = [];

  editForm: ItemLogFormGroup = this.itemLogFormService.createItemLogFormGroup();

  constructor(
    protected itemLogService: ItemLogService,
    protected itemLogFormService: ItemLogFormService,
    protected userService: UserService,
    protected outfitService: OutfitService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareOutfit = (o1: IOutfit | null, o2: IOutfit | null): boolean => this.outfitService.compareOutfit(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itemLog }) => {
      this.itemLog = itemLog;
      if (itemLog) {
        this.updateForm(itemLog);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const itemLog = this.itemLogFormService.getItemLog(this.editForm);
    if (itemLog.id !== null) {
      this.subscribeToSaveResponse(this.itemLogService.update(itemLog));
    } else {
      this.subscribeToSaveResponse(this.itemLogService.create(itemLog));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IItemLog>>): void {
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

  protected updateForm(itemLog: IItemLog): void {
    this.itemLog = itemLog;
    this.itemLogFormService.resetForm(this.editForm, itemLog);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, itemLog.owner);
    this.outfitsSharedCollection = this.outfitService.addOutfitToCollectionIfMissing<IOutfit>(this.outfitsSharedCollection, itemLog.outfit);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.itemLog?.owner)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.outfitService
      .query()
      .pipe(map((res: HttpResponse<IOutfit[]>) => res.body ?? []))
      .pipe(map((outfits: IOutfit[]) => this.outfitService.addOutfitToCollectionIfMissing<IOutfit>(outfits, this.itemLog?.outfit)))
      .subscribe((outfits: IOutfit[]) => (this.outfitsSharedCollection = outfits));
  }
}
