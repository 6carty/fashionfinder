import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ClothingItemComponent } from './list/clothing-item.component';
import { ClothingItemDetailComponent } from './detail/clothing-item-detail.component';
import { ClothingItemUpdateComponent } from './update/clothing-item-update.component';
import { ClothingItemDeleteDialogComponent } from './delete/clothing-item-delete-dialog.component';
import { ClothingItemRoutingModule } from './route/clothing-item-routing.module';

@NgModule({
  imports: [SharedModule, ClothingItemRoutingModule],
  declarations: [ClothingItemComponent, ClothingItemDetailComponent, ClothingItemUpdateComponent, ClothingItemDeleteDialogComponent],
})
export class ClothingItemModule {}
