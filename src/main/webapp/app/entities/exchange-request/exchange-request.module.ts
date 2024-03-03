import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ExchangeRequestComponent } from './list/exchange-request.component';
import { ExchangeRequestDetailComponent } from './detail/exchange-request-detail.component';
import { ExchangeRequestUpdateComponent } from './update/exchange-request-update.component';
import { ExchangeRequestDeleteDialogComponent } from './delete/exchange-request-delete-dialog.component';
import { ExchangeRequestRoutingModule } from './route/exchange-request-routing.module';

@NgModule({
  imports: [SharedModule, ExchangeRequestRoutingModule],
  declarations: [
    ExchangeRequestComponent,
    ExchangeRequestDetailComponent,
    ExchangeRequestUpdateComponent,
    ExchangeRequestDeleteDialogComponent,
  ],
})
export class ExchangeRequestModule {}
