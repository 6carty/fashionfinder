import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IPost } from '../entities/post/post.model';
import { IUserProfile } from '../entities/user-profile/user-profile.model';
import { Account } from '../core/auth/account.model';
import { PostService } from '../entities/post/service/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SortService } from '../shared/sort/sort.service';
import { DataUtils } from '../core/util/data-util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileService } from '../entities/user-profile/service/user-profile.service';
import { UserManagementService } from '../admin/user-management/service/user-management.service';
import { AccountService } from '../core/auth/account.service';
import { IUser } from '../entities/user/user.model';
import { UserService } from '../entities/user/user.service';
import { end } from '@popperjs/core';

@Component({
  selector: 'jhi-community-feed',
  templateUrl: './community-feed.component.html',
  styleUrls: ['./community-feed.component.scss'],
})
export class CommunityFeedComponent implements OnInit {
  allPosts: Observable<IPost[]> | null = null;
  userSub: Observable<IUser[]> | null = null;
  allUsers: IUser[] | null = null;
  filteredUsers: IUser[] | null = null;

  userProfileSub: Observable<IUserProfile[]> | null = null;
  allUserProfiles: IUserProfile[] | null = null;
  filteredProfile: IUserProfile[] | null = null;
  feedUserProfile: IUserProfile[] | undefined;
  currentID: any;

  account: Account | null = null;
  accountSubscription: Subscription | null = null;

  feedUsername: any;
  feedUserLocation: string | null | undefined;
  feedUserID: any;
  feedPosts: IPost[] | null = null;
  feedUser: IUser[] | null = null;

  someID: any;

  constructor(
    protected postService: PostService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    protected userProfileService: UserProfileService,
    protected userManagementService: UserManagementService,
    protected userService: UserService,
    protected accountService: AccountService
  ) {}

  initialiseServicePost(): void {
    if (this.account?.login) {
      this.userManagementService.find(this.account.login).subscribe({
        next: currentUser => {
          if (currentUser.id != null) {
            this.userProfileSub = this.userProfileService.getUserProfiles();
            this.userProfileSub.subscribe(userProfiles => {
              this.filteredProfile = userProfiles.filter(profile => profile.user?.id == currentUser.id);
              this.currentID = this.filteredProfile[0].id;
              this.filterPosts();
            });
          }
        },
      });
    }
  }

  getPostAuthor(postAuthor: IPost): void {
    if (this.userProfileSub) {
      console.log('over here pls first');
      this.userProfileSub.subscribe(userProfiles => {
        const userProfile = userProfiles.find(profile => profile.id == postAuthor.author?.id); //postAuthor.author?.id
        if (userProfile?.id) {
          this.feedUserID = userProfile.user?.id;
          // Now that we have the user profile, get the username
          this.userService.getUsers().subscribe(users => {
            const user = users.find(user => user.id == this.feedUserID);
            if (user?.id) {
              this.feedUsername = user.login;
            }
          });
        }
      });
    }
  }

  filterPosts(): void {
    this.allPosts = this.postService.getPosts();
    this.allPosts.subscribe(currentUsersPosts => {
      this.feedPosts = currentUsersPosts.filter(post => post.author?.id !== this.currentID);
      if (this.feedPosts?.length) {
        for (let i = 0; i < this.feedPosts.length; i++) {
          this.getPostAuthor(this.feedPosts[i]);
        }
      }
    });
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  trackId = (_index: number, item: IPost): number => this.postService.getPostIdentifier(item);

  ngOnInit(): void {
    this.accountSubscription = this.accountService.identity().subscribe((account: Account | null) => {
      this.account = account;
      this.initialiseServicePost();
    });
  }
}
