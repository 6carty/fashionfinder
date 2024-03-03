import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ClothingItemComponent } from '../list/clothing-item.component';
import { ClothingItemDetailComponent } from '../detail/clothing-item-detail.component';
import { ClothingItemUpdateComponent } from '../update/clothing-item-update.component';
import { ClothingItemRoutingResolveService } from './clothing-item-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const clothingItemRoute: Routes = [
  {
    path: '',
    component: ClothingItemComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ClothingItemDetailComponent,
    resolve: {
      clothingItem: ClothingItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ClothingItemUpdateComponent,
    resolve: {
      clothingItem: ClothingItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ClothingItemUpdateComponent,
    resolve: {
      clothingItem: ClothingItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(clothingItemRoute)],
  exports: [RouterModule],
})
export class ClothingItemRoutingModule {}
