import { Component, OnInit } from '@angular/core';
import { PostComponent } from '../entities/post/list/post.component';
import { Account } from '../core/auth/account.model';
import { Observable, Subscription } from 'rxjs';
import { IUserProfile } from '../entities/user-profile/user-profile.model';
import { AccountService } from '../core/auth/account.service';
import { UserProfileService } from '../entities/user-profile/service/user-profile.service';
import { UserManagementService } from '../admin/user-management/service/user-management.service';
import { IPost } from '../entities/post/post.model';
import { PostService } from '../entities/post/service/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SortService } from '../shared/sort/sort.service';
import { DataUtils } from '../core/util/data-util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-user-gallery',
  templateUrl: './user-gallery.component.html',
  styleUrls: ['./user-gallery.component.scss'],
})
export class UserGalleryComponent implements OnInit {
  allPosts: Observable<IPost[]> | null = null;
  userProfiles: IUserProfile[] | null = null;
  currentUsersPosts: IPost[] | null = null;
  account: Account | null = null;
  allUserProfiles: Observable<IUserProfile[]> | null = null;
  filteredProfile: IUserProfile[] | null = null;
  currentUser: IUserProfile | null = null;
  filteredPosts: IPost[] | null = null;
  currentID: any;
  accountSubscription: Subscription | null = null;
  postSubscription: Subscription | null = null;

  currentProfile: IUserProfile | null = null;
  isSaving: boolean = false;

  constructor(
    protected postService: PostService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    protected userProfileService: UserProfileService,
    protected userManagementService: UserManagementService,
    protected accountService: AccountService
  ) {}

  initialiseServicePost(): void {
    if (this.account?.login) {
      this.userManagementService.find(this.account.login).subscribe({
        next: currentUser => {
          if (currentUser.id != null) {
            this.allUserProfiles = this.userProfileService.getUserProfiles();
            this.allUserProfiles.subscribe(userProfiles => {
              this.filteredProfile = userProfiles.filter(profile => profile.user?.id == currentUser.id);
              this.currentID = this.filteredProfile[0].id;
              this.currentUser = this.filteredProfile[0];
              this.allPosts = this.postService.getPosts();
              this.allPosts.subscribe(currentUsersPosts => {
                this.filteredPosts = currentUsersPosts.filter(post => post.author?.id == this.currentID);
              });
            });
          }
        },
      });
    }
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  trackId = (_index: number, item: IPost): number => this.postService.getPostIdentifier(item);

  ngOnInit(): void {
    this.accountSubscription = this.accountService.identity().subscribe((account: Account | null) => {
      this.account = account;
      this.initialiseService();
      this.initialiseServicePost();
    });
  }

  protected readonly PostComponent = PostComponent;

  initialiseService(): void {
    if (this.account?.login) {
      this.userManagementService.find(this.account.login).subscribe({
        next: currentUser => {
          if (currentUser.id != null) {
            this.currentID = currentUser.id;
            this.allUserProfiles = this.userProfileService.getUserProfiles();
            this.allUserProfiles.subscribe(userProfiles => {
              this.filteredProfile = userProfiles.filter(profile => profile.user?.id == currentUser.id);
              this.currentProfile = this.filteredProfile[0];
            });
          }
        },
      });
    }
  }

  /* onCreatePostButtonClick() {
     const post: NewPost = {
       id: null,
       caption: '',
       createdDate: dayjs(),
       editedDate: dayjs(),
       author: this.currentID
     }
     this.subscribeToSaveResponsePost(this.postService.create(post));
   }

   protected subscribeToSaveResponsePost(result: Observable<HttpResponse<IPost>>): void {
     result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
       next: () => this.onSaveSuccessPost(),
       error: () => this.onSaveError(),
     });
   }


   protected onSaveSuccessPost(): void {
     this.router.navigate(['/social-chat'], //{
       //queryParams: { id: '-1' }
       //,
       //}
     );
   }

   protected onSaveError(): void {
     // Api for inheritance.
   }
   protected onSaveFinalize(): void {
     this.isSaving = false;
   }

   ngOnDestroy(): void {
     if (this.accountSubscription) {
       this.accountSubscription.unsubscribe();
     }
   }
 }*/
}
