import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TrendingOutfitComponent } from './list/trending-outfit.component';
import { TrendingOutfitDetailComponent } from './detail/trending-outfit-detail.component';
import { TrendingOutfitUpdateComponent } from './update/trending-outfit-update.component';
import { TrendingOutfitDeleteDialogComponent } from './delete/trending-outfit-delete-dialog.component';
import { TrendingOutfitRoutingModule } from './route/trending-outfit-routing.module';

@NgModule({
  imports: [SharedModule, TrendingOutfitRoutingModule],
  declarations: [
    TrendingOutfitComponent,
    TrendingOutfitDetailComponent,
    TrendingOutfitUpdateComponent,
    TrendingOutfitDeleteDialogComponent,
  ],
})
export class TrendingOutfitModule {}
