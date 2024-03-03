import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LeaderboardFormService, LeaderboardFormGroup } from './leaderboard-form.service';
import { ILeaderboard } from '../leaderboard.model';
import { LeaderboardService } from '../service/leaderboard.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';

@Component({
  selector: 'jhi-leaderboard-update',
  templateUrl: './leaderboard-update.component.html',
})
export class LeaderboardUpdateComponent implements OnInit {
  isSaving = false;
  leaderboard: ILeaderboard | null = null;

  postsSharedCollection: IPost[] = [];

  editForm: LeaderboardFormGroup = this.leaderboardFormService.createLeaderboardFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected leaderboardService: LeaderboardService,
    protected leaderboardFormService: LeaderboardFormService,
    protected postService: PostService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePost = (o1: IPost | null, o2: IPost | null): boolean => this.postService.comparePost(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ leaderboard }) => {
      this.leaderboard = leaderboard;
      if (leaderboard) {
        this.updateForm(leaderboard);
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
    const leaderboard = this.leaderboardFormService.getLeaderboard(this.editForm);
    if (leaderboard.id !== null) {
      this.subscribeToSaveResponse(this.leaderboardService.update(leaderboard));
    } else {
      this.subscribeToSaveResponse(this.leaderboardService.create(leaderboard));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILeaderboard>>): void {
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

  protected updateForm(leaderboard: ILeaderboard): void {
    this.leaderboard = leaderboard;
    this.leaderboardFormService.resetForm(this.editForm, leaderboard);

    this.postsSharedCollection = this.postService.addPostToCollectionIfMissing<IPost>(this.postsSharedCollection, leaderboard.post);
  }

  protected loadRelationshipsOptions(): void {
    this.postService
      .query()
      .pipe(map((res: HttpResponse<IPost[]>) => res.body ?? []))
      .pipe(map((posts: IPost[]) => this.postService.addPostToCollectionIfMissing<IPost>(posts, this.leaderboard?.post)))
      .subscribe((posts: IPost[]) => (this.postsSharedCollection = posts));
  }
}
