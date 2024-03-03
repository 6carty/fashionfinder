import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LikesFormService, LikesFormGroup } from './likes-form.service';
import { ILikes } from '../likes.model';
import { LikesService } from '../service/likes.service';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

@Component({
  selector: 'jhi-likes-update',
  templateUrl: './likes-update.component.html',
})
export class LikesUpdateComponent implements OnInit {
  isSaving = false;
  likes: ILikes | null = null;

  postsSharedCollection: IPost[] = [];
  userProfilesSharedCollection: IUserProfile[] = [];

  editForm: LikesFormGroup = this.likesFormService.createLikesFormGroup();

  constructor(
    protected likesService: LikesService,
    protected likesFormService: LikesFormService,
    protected postService: PostService,
    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePost = (o1: IPost | null, o2: IPost | null): boolean => this.postService.comparePost(o1, o2);

  compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ likes }) => {
      this.likes = likes;
      if (likes) {
        this.updateForm(likes);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const likes = this.likesFormService.getLikes(this.editForm);
    if (likes.id !== null) {
      this.subscribeToSaveResponse(this.likesService.update(likes));
    } else {
      this.subscribeToSaveResponse(this.likesService.create(likes));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILikes>>): void {
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

  protected updateForm(likes: ILikes): void {
    this.likes = likes;
    this.likesFormService.resetForm(this.editForm, likes);

    this.postsSharedCollection = this.postService.addPostToCollectionIfMissing<IPost>(this.postsSharedCollection, likes.post);
    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      likes.userLiked
    );
  }

  protected loadRelationshipsOptions(): void {
    this.postService
      .query()
      .pipe(map((res: HttpResponse<IPost[]>) => res.body ?? []))
      .pipe(map((posts: IPost[]) => this.postService.addPostToCollectionIfMissing<IPost>(posts, this.likes?.post)))
      .subscribe((posts: IPost[]) => (this.postsSharedCollection = posts));

    this.userProfileService
      .query()
      .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
      .pipe(
        map((userProfiles: IUserProfile[]) =>
          this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(userProfiles, this.likes?.userLiked)
        )
      )
      .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));
  }
}
