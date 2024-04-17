import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Subscription } from 'rxjs';
import { AccountService } from '../../../core/auth/account.service';
import { UserManagementService } from '../../../admin/user-management/service/user-management.service';
import { UserProfileService } from '../../user-profile/service/user-profile.service';
import { IPost } from '../post.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, PostService } from '../service/post.service';
import { PostDeleteDialogComponent } from '../delete/post-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { SortService } from 'app/shared/sort/sort.service';
import { IUserProfile } from '../../user-profile/user-profile.model';
import { NewChatroom } from '../../chatroom/chatroom.model';
import { Account } from '../../../core/auth/account.model';

@Component({
  selector: 'jhi-post',
  templateUrl: './post.component.html',
})
export class PostComponent implements OnInit {
  posts?: IPost[];
  isLoading = false;

  currentProfile: IUserProfile | null = null;
  accountSubscription: Subscription | null = null;
  account: Account | null = null;
  userProfiles: IUserProfile[] | null = null;
  filteredEntity: IUserProfile[] | null = null;
  predicate = 'id';
  ascending = true;

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

  trackId = (_index: number, item: IPost): number => this.postService.getPostIdentifier(item);

  ngOnInit(): void {
    this.load();
    this.accountSubscription = this.accountService.identity().subscribe((account: Account | null) => {
      this.account = account;
      this.loadUsers();
    });
  }
  loadUsers(): void {
    if (this.account) {
      this.userManagementService.find(this.account.login).subscribe({
        next: currentUser => {
          this.loadUserProfiles();
          this.filterData(currentUser.login);
        },
      });
    }
  }
  loadUserProfiles(): void {
    this.userProfileService.getUserProfiles().subscribe(data => {
      this.userProfiles = data;
    });
  }

  filterData(userLogin: any): void {
    if (this.userProfiles) {
      this.filteredEntity = this.userProfiles.filter(entity => entity.user == userLogin);
      if (this.filteredEntity && this.filteredEntity.length > 0) {
        this.currentProfile = this.filteredEntity[0];
        console.log(this.currentProfile);
      } else {
        console.log('filteredEntities is empty or undefined.');
      }
    }
  }
  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(post: IPost): void {
    const modalRef = this.modalService.open(PostDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.post = post;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.posts = this.refineData(dataFromBody);
  }

  protected refineData(data: IPost[]): IPost[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IPost[] | null): IPost[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.postService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
