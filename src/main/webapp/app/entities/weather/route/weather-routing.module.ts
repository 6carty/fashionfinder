import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { WeatherComponent } from '../list/weather.component';
import { WeatherDetailComponent } from '../detail/weather-detail.component';
import { WeatherUpdateComponent } from '../update/weather-update.component';
import { WeatherRoutingResolveService } from './weather-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const weatherRoute: Routes = [
  {
    path: '',
    component: WeatherComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WeatherDetailComponent,
    resolve: {
      weather: WeatherRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: WeatherUpdateComponent,
    resolve: {
      weather: WeatherRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WeatherUpdateComponent,
    resolve: {
      weather: WeatherRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(weatherRoute)],
  exports: [RouterModule],
})
export class WeatherRoutingModule {}
