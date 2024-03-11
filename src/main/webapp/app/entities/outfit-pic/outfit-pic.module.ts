import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OutfitPicComponent } from './list/outfit-pic.component';
import { OutfitPicDetailComponent } from './detail/outfit-pic-detail.component';
import { OutfitPicUpdateComponent } from './update/outfit-pic-update.component';
import { OutfitPicDeleteDialogComponent } from './delete/outfit-pic-delete-dialog.component';
import { OutfitPicRoutingModule } from './route/outfit-pic-routing.module';

@NgModule({
  imports: [SharedModule, OutfitPicRoutingModule],
  declarations: [OutfitPicComponent, OutfitPicDetailComponent, OutfitPicUpdateComponent, OutfitPicDeleteDialogComponent],
})
export class OutfitPicModule {}
