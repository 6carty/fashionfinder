import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserMilestoneComponent } from './list/user-milestone.component';
import { UserMilestoneDetailComponent } from './detail/user-milestone-detail.component';
import { UserMilestoneUpdateComponent } from './update/user-milestone-update.component';
import { UserMilestoneDeleteDialogComponent } from './delete/user-milestone-delete-dialog.component';
import { UserMilestoneRoutingModule } from './route/user-milestone-routing.module';

@NgModule({
  imports: [SharedModule, UserMilestoneRoutingModule],
  declarations: [UserMilestoneComponent, UserMilestoneDetailComponent, UserMilestoneUpdateComponent, UserMilestoneDeleteDialogComponent],
})
export class UserMilestoneModule {}
