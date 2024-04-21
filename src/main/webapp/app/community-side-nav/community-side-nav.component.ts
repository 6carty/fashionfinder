import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AccountService } from '../core/auth/account.service';
import { Account } from '../core/auth/account.model';
import { IUserProfile } from '../entities/user-profile/user-profile.model';
import { UserProfileService } from '../entities/user-profile/service/user-profile.service';
import { UserManagementService } from '../admin/user-management/service/user-management.service';
import { IPost, NewPost } from '../entities/post/post.model';
import dayjs from 'dayjs/esm';
import { HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { PostService } from '../entities/post/service/post.service';
import { Router } from '@angular/router';
import { ILikes } from '../entities/likes/likes.model';
import { LikesService } from '../entities/likes/service/likes.service';
import { CommunityFeedComponent } from '../community-feed/community-feed.component';

@Component({
  selector: 'jhi-community-side-nav',
  templateUrl: './community-side-nav.component.html',
  styleUrls: ['./community-side-nav.component.scss'],
})
export class CommunitySideNavComponent implements OnInit {
  account: Account | null = null;
  allUserProfiles: Observable<IUserProfile[]> | null = null;
  filteredProfile: IUserProfile[] | null = null;
  currentProfile: IUserProfile | null = null;
  isSaving: boolean = false;
  currentID: any;
  allLikes: Observable<ILikes[]> | null = null;
  feedLikes: ILikes[] | null = null;
  filteredLikes: ILikes[] | null = null;
  likePos: number = 0;
  allPosts: Observable<IPost[]> | null = null;
  feedPosts: IPost[] | null = null;
  likeDetails: { likeCount: number; postID: any }[][] = [];
  totalLikes: number = 0;
  accountSubscription: Subscription | null = null;
  constructor(
    private accountService: AccountService,
    private userProfileService: UserProfileService,
    private userManagementService: UserManagementService,
    private postService: PostService,
    private router: Router,
    private likeService: LikesService
  ) {}

  findTotalLikeCount(userID: number): void {
    this.allPosts = null;
    this.feedPosts = null;
    this.allPosts = this.postService.getPosts();
    this.allPosts.subscribe(currentUsersPosts => {
      this.feedPosts = currentUsersPosts;
      this.feedPosts = currentUsersPosts.filter(post => post.author?.id == userID);
      this.allLikes = this.likeService.getLikes();
      this.allLikes.subscribe(currentUsersLikes => {
        this.feedLikes = currentUsersLikes;
        if (this.feedPosts)
          for (let i = 0; i < this.feedPosts?.length; i++) {
            // @ts-ignore
            this.filteredLikes = this.feedLikes.filter(like => like.post.id === this.feedPosts[i].id && like.like == true);
            this.totalLikes = this.feedLikes.length;
          }
      });
    });
  }

  filterPosts(userID: number): void {}
  initialiseService(): void {
    if (this.account?.login) {
      this.userManagementService.find(this.account.login).subscribe({
        next: currentUser => {
          if (currentUser.id != null) {
            this.currentID = currentUser.id;
            // @ts-ignore
            this.allUserProfiles = this.userProfileService.getUserProfiles();
            // @ts-ignore
            this.allUserProfiles.subscribe(userProfiles => {
              this.filteredProfile = userProfiles.filter(profile => profile.user?.id == currentUser.id);
              this.currentProfile = this.filteredProfile[0];
              this.filterPosts(this.currentID);
              this.findTotalLikeCount(this.currentProfile.id);
            });
          }
        },
      });
    }
  }
  ngOnInit(): void {
    this.accountSubscription = this.accountService.identity().subscribe((account: Account | null) => {
      this.account = account;
      this.initialiseService();
    });
  }

  onCreatePostButtonClick() {
    const post: NewPost = {
      id: null,
      caption: '',
      createdDate: dayjs(),
      editedDate: dayjs(),
      author: this.currentID,
    };
    this.subscribeToSaveResponsePost(this.postService.create(post));
  }

  protected subscribeToSaveResponsePost(result: Observable<HttpResponse<IPost>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccessPost(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccessPost(): void {
    this.router.navigate(
      ['/social-chat'] //{
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
}
