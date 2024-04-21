import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IPost, NewPost } from '../entities/post/post.model';
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
import { UserService } from '../entities/user/user.service';
import { IComment } from '../entities/comment/comment.model';
import { CommentService } from '../entities/comment/service/comment.service';
import { ILikes } from '../entities/likes/likes.model';
import { LikesService } from '../entities/likes/service/likes.service';

@Component({
  selector: 'jhi-community-feed',
  templateUrl: './community-feed.component.html',
  styleUrls: ['./community-feed.component.scss'],
})
export class CommunityFeedComponent implements OnInit {
  allPosts: Observable<IPost[]> | null = null;
  feedPosts: IPost[] | null = null;
  feedUsernames: { username: string; imageType: any; imageURL: any }[][] = [];
  tempUsername: any;
  feedUserID: any;

  userProfileSub: Observable<IUserProfile[]> | null = null;
  filteredProfile: IUserProfile[] | null = null;

  currentID: any;

  account: Account | null = null;
  accountSubscription: Subscription | null = null;

  allComments: Observable<IComment[]> | null = null;
  feedComments: IComment[] | null = null;
  visibleComment: any;
  commentFrom: any;

  allLikes: Observable<ILikes[]> | null = null;
  feedLikes: ILikes[] | null = null;
  likePos: number = 0;
  likeDetails: { likeCount: number; postID: any }[][] = [];
  totalLikes: number = 0;

  quickID: any;
  currentCommentPos: number = 0;
  userPos: number = 0;

  everyPostsInfo: { visibleComment: string; commentFrom: string; postID: any }[][] = [];

  isSaving = false;

  constructor(
    protected postService: PostService,
    protected commentService: CommentService,
    protected likeService: LikesService,
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    protected sortService: SortService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    protected userProfileService: UserProfileService,
    protected userManagementService: UserManagementService,
    protected userService: UserService,
    protected accountService: AccountService
  ) {}

  filterLikes(postID: number, index: number): void {
    this.likeDetails.push([{ likeCount: 0, postID: '' }]);
    this.allLikes = this.likeService.getLikes();
    this.allLikes.subscribe(currentUsersLikes => {
      //get all comments for a specific post
      this.feedLikes = currentUsersLikes;
      this.feedLikes = currentUsersLikes.filter(like => like.post?.id === postID && like.like == true);
      if (this.feedLikes.length) {
        this.likeDetails[index][0].likeCount = this.feedLikes.length;
        this.likeDetails[index][0].postID = postID;
        this.likePos += 1;
        if (this.likePos === this.feedLikes.length) {
          this.likeDetails.sort((a, b) => a[0].postID - b[0].postID);
        }
      }
    });
  }

  initialiseServicePost(): void {
    if (this.account?.login) {
      this.userManagementService.find(this.account.login).subscribe({
        next: currentUser => {
          if (currentUser.id != null) {
            // @ts-ignore
            this.userProfileSub = this.userProfileService.getUserProfiles();
            // @ts-ignore
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

  filterPosts(): void {
    this.allPosts = null;
    this.feedPosts = null;

    this.allPosts = this.postService.getPosts();

    this.allPosts.subscribe(currentUsersPosts => {
      this.feedPosts = currentUsersPosts;
      this.feedPosts = currentUsersPosts.filter(post => post.author?.id !== this.currentID);
      /*this.feedPosts.sort((a, b) => {
        if (a.createdDate && b.createdDate) {
          return b.createdDate.date() - a.createdDate.date();
        }
        // Handle the case where postCommented is undefined
        return 0;
      });*/

      if (this.feedPosts) {
        this.feedPosts.forEach((post, index) => {
          this.feedUsernames.push([{ username: '', imageType: '', imageURL: '' }]);
        });
      }
      for (let i = 0; i < this.feedPosts.length; i++) {
        this.getPostAuthor(this.feedPosts[i], i);
        this.filterComments(this.feedPosts[i].id, i);
        this.filterLikes(this.feedPosts[i].id, i);
      }
    });
  }

  filterComments(postID: number, index: number): void {
    this.everyPostsInfo.push([{ visibleComment: '', commentFrom: '', postID: '' }]);
    this.allComments = this.commentService.getComments();

    this.allComments.subscribe(currentUsersComments => {
      //get all comments for a specific post
      this.feedComments = currentUsersComments;
      this.feedComments.sort((a, b) => {
        if (a.postCommented && b.postCommented) {
          return a.postCommented.id - b.postCommented.id;
        }
        // Handle the case where postCommented is undefined
        return 0;
      });
      this.feedComments = currentUsersComments.filter(comment => comment.postCommented?.id === postID);
      //console.log(this.feedComments , "filtered" , postID)
      this.visibleComment = '';
      if (this.feedComments.length) {
        this.visibleComment = this.feedComments[0].content;
        this.quickID = this.feedComments[0].userCommented?.id;
        this.everyPostsInfo[this.currentCommentPos][0].visibleComment = this.visibleComment;
        this.everyPostsInfo[this.currentCommentPos][0].postID = postID;
      }
      this.getCommentAuthor(this.quickID, this.currentCommentPos);
      this.currentCommentPos += 1;
    });
  }

  getCommentAuthor(postAuthorID: number | undefined, index: number): void {
    this.commentFrom = '';
    if (this.userProfileSub) {
      this.userProfileSub.subscribe(userProfiles => {
        let userProfile = userProfiles.find(profile => profile.id === postAuthorID);
        if (userProfile?.id) {
          // Now that we have the user profile, get the username
          this.userService.getUsers().subscribe(users => {
            let user = users.find(user => user.id === userProfile?.user?.id);
            if (user?.login) {
              this.commentFrom = user.login;
              this.everyPostsInfo[index][0].commentFrom = this.commentFrom;
              this.userPos += 1;
              if (this.userPos === this.everyPostsInfo.length) {
                this.everyPostsInfo.sort((a, b) => a[0].postID - b[0].postID);
              }
            }
          });
        }
      });
    }
  }

  getPostAuthor(postAuthor: IPost, index: number): void {
    this.tempUsername = '';
    // this.feedUserID = null;
    if (this.userProfileSub) {
      this.userProfileSub.subscribe(userProfiles => {
        let userProfile = userProfiles.find(profile => profile.id === postAuthor.author?.id);
        this.feedUsernames[index][0].imageType = userProfile?.profilePictureContentType;
        this.feedUsernames[index][0].imageURL = userProfile?.profilePicture;
        if (userProfile?.user) {
          this.feedUserID = userProfile.user?.id;
          // Now that we have the user profile, get the username
          this.userService.getUsers().subscribe(users => {
            let user = users.find(user => user.id === userProfile?.user?.id);
            if (user?.login) {
              this.tempUsername = user.login;
              this.feedUsernames[index][0].username = this.tempUsername;
            }
          });
        }
      });
    }
  }

  trackId = (_index: number, item: IPost): number => this.postService.getPostIdentifier(item);

  ngOnInit(): void {
    this.accountSubscription = this.accountService.identity().subscribe((account: Account | null) => {
      this.account = account;
      this.initialiseServicePost();
    });
  }
}
