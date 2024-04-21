import { Component, OnInit } from '@angular/core';
import { PostService } from '../entities/post/service/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileService } from '../entities/user-profile/service/user-profile.service';
import { AccountService } from '../core/auth/account.service';
import { UserService } from '../entities/user/user.service';
import { IPost } from '../entities/post/post.model';
import { IUser } from '../entities/user/user.model';
import { IUserProfile } from '../entities/user-profile/user-profile.model';
import { Account } from '../core/auth/account.model';
import dayjs from 'dayjs/esm';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

import { SortService } from '../shared/sort/sort.service';
import { DataUtils } from '../core/util/data-util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
})
export class PostFormComponent implements OnInit {
  constructor(
    private postService: PostService,
    protected activatedRoute: ActivatedRoute,
    protected sortService: SortService,
    public router: Router,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    private userProfileService: UserProfileService,
    private accountService: AccountService,
    private userService: UserService
  ) {}

  postReceivedData: IPost[] | null = null;
  postToEdit: IPost | null = null;
  givenId: number = -1;
  id: number = 0;
  caption: any;
  userInputPhoto: any;
  isSaving = false;
  users: IUser[] | null = null;
  user: IUser | undefined = undefined;
  userProfile: IUserProfile | undefined = undefined;
  userProfilePick: Pick<IUserProfile, 'id'> | null = null;
  active: Account | undefined = undefined;
  userProfiles: IUserProfile[] | undefined = undefined;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.givenId = params.id;

      this.accountService.identity().subscribe(account => {
        if (account) this.active = account;

        this.userService.query().subscribe(users => {
          this.users = users.body;
          if (this.users) this.user = this.users.find(user => user.login === this.active?.login);
          if (this.user) {
            const pickUser: Pick<IUser, 'id'> = this.user;
            const queryObject = {
              'user.equal': pickUser,
            };
            this.userProfileService.query(queryObject).subscribe(userProfile => {
              if (userProfile.body) {
                this.userProfiles = userProfile.body.filter(obj => obj.user?.id == this.user?.id);
                this.userProfile = this.userProfiles[0];
                this.userProfilePick = this.userProfile;
              }

              this.fetchPosts();
            });
          }
        });
      });
    });
  }

  fetchPosts() {
    this.postService.query().subscribe(aPost => {
      this.postReceivedData = aPost.body;
      if (this.postReceivedData) this.postReceivedData = this.postReceivedData.filter(bPost => bPost.author?.id == this.userProfile?.id);

      if (this.postReceivedData) {
        for (let item of this.postReceivedData) {
          if (item.id == this.givenId) {
            this.postToEdit = item;
            this.id = this.postToEdit.id;
          }
        }
      }
    });
  }

  deleteButtonPressed() {
    if (this.postToEdit != null) {
      this.postService.delete(this.postToEdit.id).subscribe(() => {
        this.router.navigate(['/community']);
      });
    }
  }

  saveButtonPressed() {
    this.caption = document.getElementById('Caption') as HTMLInputElement;
    const inputElementPhoto = document.getElementById('Photo') as HTMLInputElement;
    if (inputElementPhoto.files && inputElementPhoto.files.length != 0) {
      const selectedFile = inputElementPhoto.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        if (reader.result && typeof reader.result === 'string') {
          var base64result = reader.result.split(',')[1];
          this.userInputPhoto = base64result;
        } else {
          this.userInputPhoto = null;
        }

        if (this.postToEdit) {
          this.postToEdit.caption = this.caption.value;
          this.postToEdit.editedDate = dayjs();
          this.postToEdit.createdDate = dayjs();
        }
        if (inputElementPhoto.files && this.postToEdit) {
          this.postToEdit.image = this.userInputPhoto;
          this.postToEdit.imageContentType = inputElementPhoto.files[0].type;
        }
        if (this.postToEdit != null) {
          this.subscribeToSaveResponse(this.postService.update(this.postToEdit));
        }
      };

      if (selectedFile) {
        reader.readAsDataURL(selectedFile);
      }
    } else {
      if (this.postToEdit) {
        this.postToEdit.caption = this.caption.value;
        this.postToEdit.editedDate = dayjs();
        this.postToEdit.createdDate = dayjs();
      }
      if (this.postToEdit != null) {
        this.subscribeToSaveResponse(this.postService.update(this.postToEdit));
      }
    }
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPost>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccessClothing(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccessClothing(): void {
    window.location.reload();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
