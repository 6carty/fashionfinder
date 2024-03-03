import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { MilestoneTypeFormService, MilestoneTypeFormGroup } from './milestone-type-form.service';
import { IMilestoneType } from '../milestone-type.model';
import { MilestoneTypeService } from '../service/milestone-type.service';

@Component({
  selector: 'jhi-milestone-type-update',
  templateUrl: './milestone-type-update.component.html',
})
export class MilestoneTypeUpdateComponent implements OnInit {
  isSaving = false;
  milestoneType: IMilestoneType | null = null;

  editForm: MilestoneTypeFormGroup = this.milestoneTypeFormService.createMilestoneTypeFormGroup();

  constructor(
    protected milestoneTypeService: MilestoneTypeService,
    protected milestoneTypeFormService: MilestoneTypeFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ milestoneType }) => {
      this.milestoneType = milestoneType;
      if (milestoneType) {
        this.updateForm(milestoneType);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const milestoneType = this.milestoneTypeFormService.getMilestoneType(this.editForm);
    if (milestoneType.id !== null) {
      this.subscribeToSaveResponse(this.milestoneTypeService.update(milestoneType));
    } else {
      this.subscribeToSaveResponse(this.milestoneTypeService.create(milestoneType));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMilestoneType>>): void {
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

  protected updateForm(milestoneType: IMilestoneType): void {
    this.milestoneType = milestoneType;
    this.milestoneTypeFormService.resetForm(this.editForm, milestoneType);
  }
}
