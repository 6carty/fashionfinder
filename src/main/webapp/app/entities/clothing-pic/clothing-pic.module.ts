import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ClothingPicComponent } from './list/clothing-pic.component';
import { ClothingPicDetailComponent } from './detail/clothing-pic-detail.component';
import { ClothingPicUpdateComponent } from './update/clothing-pic-update.component';
import { ClothingPicDeleteDialogComponent } from './delete/clothing-pic-delete-dialog.component';
import { ClothingPicRoutingModule } from './route/clothing-pic-routing.module';

@NgModule({
  imports: [SharedModule, ClothingPicRoutingModule],
  declarations: [ClothingPicComponent, ClothingPicDetailComponent, ClothingPicUpdateComponent, ClothingPicDeleteDialogComponent],
})
export class ClothingPicModule {}
