import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FashionTipComponent } from './list/fashion-tip.component';
import { FashionTipDetailComponent } from './detail/fashion-tip-detail.component';
import { FashionTipUpdateComponent } from './update/fashion-tip-update.component';
import { FashionTipDeleteDialogComponent } from './delete/fashion-tip-delete-dialog.component';
import { FashionTipRoutingModule } from './route/fashion-tip-routing.module';

@NgModule({
  imports: [SharedModule, FashionTipRoutingModule],
  declarations: [FashionTipComponent, FashionTipDetailComponent, FashionTipUpdateComponent, FashionTipDeleteDialogComponent],
})
export class FashionTipModule {}
