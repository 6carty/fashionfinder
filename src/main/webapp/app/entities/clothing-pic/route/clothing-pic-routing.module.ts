import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ClothingPicComponent } from '../list/clothing-pic.component';
import { ClothingPicDetailComponent } from '../detail/clothing-pic-detail.component';
import { ClothingPicUpdateComponent } from '../update/clothing-pic-update.component';
import { ClothingPicRoutingResolveService } from './clothing-pic-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const clothingPicRoute: Routes = [
  {
    path: '',
    component: ClothingPicComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ClothingPicDetailComponent,
    resolve: {
      clothingPic: ClothingPicRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ClothingPicUpdateComponent,
    resolve: {
      clothingPic: ClothingPicRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ClothingPicUpdateComponent,
    resolve: {
      clothingPic: ClothingPicRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(clothingPicRoute)],
  exports: [RouterModule],
})
export class ClothingPicRoutingModule {}
