import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FashionTipComponent } from '../list/fashion-tip.component';
import { FashionTipDetailComponent } from '../detail/fashion-tip-detail.component';
import { FashionTipUpdateComponent } from '../update/fashion-tip-update.component';
import { FashionTipRoutingResolveService } from './fashion-tip-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const fashionTipRoute: Routes = [
  {
    path: '',
    component: FashionTipComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FashionTipDetailComponent,
    resolve: {
      fashionTip: FashionTipRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FashionTipUpdateComponent,
    resolve: {
      fashionTip: FashionTipRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FashionTipUpdateComponent,
    resolve: {
      fashionTip: FashionTipRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(fashionTipRoute)],
  exports: [RouterModule],
})
export class FashionTipRoutingModule {}
