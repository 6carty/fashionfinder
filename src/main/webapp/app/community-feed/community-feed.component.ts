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

@Component({
  selector: 'jhi-community-feed',
  templateUrl: './community-feed.component.html',
  styleUrls: ['./community-feed.component.scss'],
})
export class CommunityFeedComponent implements OnInit {
  allPosts: Observable<IPost[]> | null = null;
  userProfiles: IUserProfile[] | null = null;
  account: Account | null = null;
  everyUser: Observable<IUserProfile[]> | null = null;
  allUserProfiles: IUserProfile[] | null = null;
  feedUserProfile: IUserProfile[] | null = null;
  feedUser: IUser | null = null;
  feedUsername: string | null | undefined;
  feedUserLocation: string | null | undefined;
  filteredProfile: IUserProfile[] | null = null;
  filteredPosts: IPost[] | null = null;
  currentID: any;
  accountSubscription: Subscription | null = null;

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
            this.everyUser = this.userProfileService.getUserProfiles();
            this.everyUser.subscribe(userProfiles => {
              this.allUserProfiles = userProfiles;
              this.filteredProfile = userProfiles.filter(profile => profile.user?.id == currentUser.id);
              this.currentID = this.filteredProfile[0].id;
              this.allPosts = this.postService.getPosts();
              this.allPosts.subscribe(currentUsersPosts => {
                this.filteredPosts = currentUsersPosts.filter(post => post.author?.id !== this.currentID);
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
      this.initialiseServicePost();
    });
  }
}
