/*

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
import {ThisReceiver} from "@angular/compiler";

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
}
*/

import { Component, OnInit } from '@angular/core';
import { Account } from '../core/auth/account.model';
import { Observable, Subscription } from 'rxjs';
import { IUserProfile } from '../entities/user-profile/user-profile.model';
import { AccountService } from '../core/auth/account.service';
import { UserProfileService } from '../entities/user-profile/service/user-profile.service';
import { UserManagementService } from '../admin/user-management/service/user-management.service';
import { IPost } from '../entities/post/post.model';
import { PostService } from '../entities/post/service/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataUtils } from '../core/util/data-util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LikesService } from '../entities/likes/service/likes.service';
import { ILikes } from '../entities/likes/likes.model';

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
