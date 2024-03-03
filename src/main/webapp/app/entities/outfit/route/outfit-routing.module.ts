import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OutfitComponent } from '../list/outfit.component';
import { OutfitDetailComponent } from '../detail/outfit-detail.component';
import { OutfitUpdateComponent } from '../update/outfit-update.component';
import { OutfitRoutingResolveService } from './outfit-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const outfitRoute: Routes = [
  {
    path: '',
    component: OutfitComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OutfitDetailComponent,
    resolve: {
      outfit: OutfitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OutfitUpdateComponent,
    resolve: {
      outfit: OutfitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OutfitUpdateComponent,
    resolve: {
      outfit: OutfitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(outfitRoute)],
  exports: [RouterModule],
})
export class OutfitRoutingModule {}
