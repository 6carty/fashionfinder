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
import { ActivatedRoute, Router } from '@angular/router';
import { ILikes } from '../entities/likes/likes.model';
import { LikesService } from '../entities/likes/service/likes.service';
import { CommunityFeedComponent } from '../community-feed/community-feed.component';
import { DataUtils } from '../core/util/data-util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-community-side-nav',
  templateUrl: './community-side-nav.component.html',
  styleUrls: ['./community-side-nav.component.scss'],
})
export class CommunitySideNavComponent implements OnInit {
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
  likeDetails: { likeCount: number; postID: any }[][] = [];
  allLikes: Observable<ILikes[]> | null = null;
  feedLikes: ILikes[] | null = null;
  likePos: number = 0;
  totalLikes: number = 0;

  constructor(
    protected postService: PostService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected dataUtils: DataUtils,
    protected likeService: LikesService,
    protected modalService: NgbModal,
    protected userProfileService: UserProfileService,
    protected userManagementService: UserManagementService,
    protected accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.accountSubscription = this.accountService.identity().subscribe((account: Account | null) => {
      this.account = account;
      this.initialiseService();
    });
  }

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
              this.initialiseServicePost(); // Call initialiseServicePost() here
            });
          }
        },
      });
    }
  }

  initialiseServicePost(): void {
    if (this.currentProfile) {
      this.allPosts = this.postService.getPosts();
      this.allPosts.subscribe(currentUsersPosts => {
        this.filteredPosts = currentUsersPosts.filter(post => post.author?.id == this.currentProfile?.id);

        if (this.filteredPosts) {
          this.filteredPosts.forEach((post, index) => {
            this.likeDetails.push([{ likeCount: 0, postID: '' }]);
          });
        }
        for (let i = 0; i < this.filteredPosts.length; i++) {
          this.filterLikes(this.filteredPosts[i].id, i);
        }
      });
    }
  }

  filterLikes(postID: number, index: number): void {
    this.allLikes = this.likeService.getLikes();
    this.allLikes.subscribe(currentUsersLikes => {
      //get all likes for a specific post
      this.feedLikes = currentUsersLikes;
      this.feedLikes = currentUsersLikes.filter(like => like.post?.id === postID);
      if (this.feedLikes.length) {
        this.totalLikes += this.feedLikes.length;
        console.log(this.totalLikes);
        this.likeDetails[index][0].likeCount = this.feedLikes.length;
        this.likeDetails[index][0].postID = postID;
        this.likePos += 1;
        if (this.likePos === this.feedLikes.length) {
          this.likeDetails.sort((a, b) => a[0].postID - b[0].postID);
        }
      }
    });
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  trackId = (_index: number, item: IPost): number => this.postService.getPostIdentifier(item);
}
