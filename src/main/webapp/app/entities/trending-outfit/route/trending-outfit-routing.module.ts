import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TrendingOutfitComponent } from '../list/trending-outfit.component';
import { TrendingOutfitDetailComponent } from '../detail/trending-outfit-detail.component';
import { TrendingOutfitUpdateComponent } from '../update/trending-outfit-update.component';
import { TrendingOutfitRoutingResolveService } from './trending-outfit-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const trendingOutfitRoute: Routes = [
  {
    path: '',
    component: TrendingOutfitComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TrendingOutfitDetailComponent,
    resolve: {
      trendingOutfit: TrendingOutfitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TrendingOutfitUpdateComponent,
    resolve: {
      trendingOutfit: TrendingOutfitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TrendingOutfitUpdateComponent,
    resolve: {
      trendingOutfit: TrendingOutfitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(trendingOutfitRoute)],
  exports: [RouterModule],
})
export class TrendingOutfitRoutingModule {}
