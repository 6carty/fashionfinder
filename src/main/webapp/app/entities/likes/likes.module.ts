import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LikesComponent } from './list/likes.component';
import { LikesDetailComponent } from './detail/likes-detail.component';
import { LikesUpdateComponent } from './update/likes-update.component';
import { LikesDeleteDialogComponent } from './delete/likes-delete-dialog.component';
import { LikesRoutingModule } from './route/likes-routing.module';

@NgModule({
  imports: [SharedModule, LikesRoutingModule],
  declarations: [LikesComponent, LikesDetailComponent, LikesUpdateComponent, LikesDeleteDialogComponent],
})
export class LikesModule {}
