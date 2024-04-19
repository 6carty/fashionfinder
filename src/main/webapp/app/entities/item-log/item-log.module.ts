import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ItemLogComponent } from './list/item-log.component';
import { ItemLogDetailComponent } from './detail/item-log-detail.component';
import { ItemLogUpdateComponent } from './update/item-log-update.component';
import { ItemLogDeleteDialogComponent } from './delete/item-log-delete-dialog.component';
import { ItemLogRoutingModule } from './route/item-log-routing.module';

@NgModule({
  imports: [SharedModule, ItemLogRoutingModule],
  declarations: [ItemLogComponent, ItemLogDetailComponent, ItemLogUpdateComponent, ItemLogDeleteDialogComponent],
})
export class ItemLogModule {}
