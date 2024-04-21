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

@Component({
  selector: 'jhi-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
})
export class PostFormComponent implements OnInit {
  constructor(
    private postService: PostService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    private userProfileService: UserProfileService,
    private accountService: AccountService,
    private userService: UserService
  ) {}

  postReceivedData: IPost[] | null = null;
  postItemToEdit: IPost | any;
  givenId: number = -1;

  caption: string = '';
  userInputPhoto: any;
  deleting: boolean = false;
  isSaving = false;
  users: IUser[] | null = null;
  user: IUser | undefined = undefined;
  userProfile: IUserProfile | undefined = undefined;

  ngOnInit(): void {
    /*this.activatedRoute.queryParams.subscribe(params => {
      this.givenId = params.id;

      this.accountService.identity().subscribe(account => {
        if (account) this.user = account;

        this.userService.query().subscribe(users => {
          this.users = users.body;
          if (this.users) this.user = this.users.find(user => user.login === this.user?.login);
          if (this.user) {
            const queryObject = {
              'user.equal': this.user,
            };
            this.userProfileService.query(queryObject).subscribe(userProfile => {
              if (userProfile.body) {
                this.userProfile = userProfile.body.filter(obj => obj.user?.id == this.user?.id)[0];
              }
              this.fetchPosts();
            });
          }
        });
      });
    });*/
  }

  fetchPosts() {
    this.postService.query().subscribe(posts => {
      this.postReceivedData = posts.body;
      if (this.postReceivedData) {
        this.postItemToEdit = this.postReceivedData.find(post => post.id == this.givenId);
      }
    });
  }

  deleteButtonPressed() {
    if (this.postItemToEdit) {
      this.postService.delete(this.postItemToEdit.id).subscribe(() => {
        this.router.navigate(['/community']);
      });
    }
  }

  saveButtonPressed() {
    const inputElementPhoto = document.getElementById('Photo') as HTMLInputElement;

    if (inputElementPhoto.files && inputElementPhoto.files.length != 0) {
      const selectedFile = inputElementPhoto.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        if (reader.result && typeof reader.result === 'string') {
          let base64result = reader.result.split(',')[1];
          this.userInputPhoto = base64result;
        } else {
          this.userInputPhoto = null;
        }

        const newPost: IPost = {
          id: this.postItemToEdit?.id || 0,
          caption: this.caption,
          editedDate: dayjs(),
          createdDate: dayjs(),
          totalLikes: this.postItemToEdit?.totalLikes || 0,
          author: this.userProfile,
        };

        if (inputElementPhoto.files && newPost) {
          newPost.image = this.userInputPhoto;
          newPost.imageContentType = inputElementPhoto.files[0].type;
        }

        if (this.postItemToEdit) {
          this.subscribeToSaveResponse(this.postService.update(newPost));
        } else {
          //this.subscribeToSaveResponse(this.postService.create(newPost.id));
        }
      };

      if (selectedFile) {
        reader.readAsDataURL(selectedFile);
      }
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPost>>): void {
    this.isSaving = true;
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => {
        this.onSaveSuccess();
        this.router.navigate(['/community']);
      },
      error: () => {
        this.isSaving = false;
        // Handle error
      },
    });
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    // Handle success if needed
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
