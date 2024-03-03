import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MilestoneTypeComponent } from './list/milestone-type.component';
import { MilestoneTypeDetailComponent } from './detail/milestone-type-detail.component';
import { MilestoneTypeUpdateComponent } from './update/milestone-type-update.component';
import { MilestoneTypeDeleteDialogComponent } from './delete/milestone-type-delete-dialog.component';
import { MilestoneTypeRoutingModule } from './route/milestone-type-routing.module';

@NgModule({
  imports: [SharedModule, MilestoneTypeRoutingModule],
  declarations: [MilestoneTypeComponent, MilestoneTypeDetailComponent, MilestoneTypeUpdateComponent, MilestoneTypeDeleteDialogComponent],
})
export class MilestoneTypeModule {}
