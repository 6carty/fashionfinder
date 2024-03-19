import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OutfitPicComponent } from '../list/outfit-pic.component';
import { OutfitPicDetailComponent } from '../detail/outfit-pic-detail.component';
import { OutfitPicUpdateComponent } from '../update/outfit-pic-update.component';
import { OutfitPicRoutingResolveService } from './outfit-pic-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const outfitPicRoute: Routes = [
  {
    path: '',
    component: OutfitPicComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OutfitPicDetailComponent,
    resolve: {
      outfitPic: OutfitPicRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OutfitPicUpdateComponent,
    resolve: {
      outfitPic: OutfitPicRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OutfitPicUpdateComponent,
    resolve: {
      outfitPic: OutfitPicRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(outfitPicRoute)],
  exports: [RouterModule],
})
export class OutfitPicRoutingModule {}
