import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OutfitComponent } from './list/outfit.component';
import { OutfitDetailComponent } from './detail/outfit-detail.component';
import { OutfitUpdateComponent } from './update/outfit-update.component';
import { OutfitDeleteDialogComponent } from './delete/outfit-delete-dialog.component';
import { OutfitRoutingModule } from './route/outfit-routing.module';

@NgModule({
  imports: [SharedModule, OutfitRoutingModule],
  declarations: [OutfitComponent, OutfitDetailComponent, OutfitUpdateComponent, OutfitDeleteDialogComponent],
})
export class OutfitModule {}
