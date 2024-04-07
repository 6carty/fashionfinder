import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GdprComponent } from './gdpr/gdpr.component';
import { CommunityComponent } from './community/community.component';
import { FashionPlannerComponent } from './fashion-planner/fashion-planner.component';
import { SocialChatComponent } from './social-chat/social-chat.component';
import { MixAndMatchComponent } from './mix-and-match/mix-and-match.component';
import { WardrobeComponent } from './wardrobe/wardrobe.component';
import { SustainabilityComponent } from './sustainability/sustainability.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { OutfitEditComponent } from './outfit-edit/outfit-edit.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },
        {
          path: 'login',
          loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        },
        {
          path: '',
          loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
        },
        {
          path: 'community',
          component: CommunityComponent,
        },
        {
          path: 'gdpr',
          component: GdprComponent,
        },
        {
          path: 'fashion-planner',
          component: FashionPlannerComponent,
        },
        {
          path: 'social-chat',
          component: SocialChatComponent,
        },
        {
          path: 'mix-and-match',
          component: MixAndMatchComponent,
        },
        {
          path: 'wardrobe',
          component: WardrobeComponent,
        },
        {
          path: 'sustainability',
          component: SustainabilityComponent,
        },
        {
          path: 'analytics',
          component: AnalyticsComponent,
        },
        {
          path: 'preferences',
          component: PreferencesComponent,
        },
        {
          path: 'outfit-edit',
          component: OutfitEditComponent,
        },
        navbarRoute,
        ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
