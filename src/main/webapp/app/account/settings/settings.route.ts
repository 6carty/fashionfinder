import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SettingsComponent } from './settings.component';
import { UserProfileComponent } from '../../entities/user-profile/list/user-profile.component';
import { PostComponent } from '../../entities/post/list/post.component';

export const settingsRoute: Route = {
  path: 'settings',
  component: SettingsComponent,
  data: {
    pageTitle: 'Settings',
  },
  canActivate: [UserRouteAccessService],
};
