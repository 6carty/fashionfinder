import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IExchangeRequest } from '../exchange-request.model';
import { ExchangeRequestService } from '../service/exchange-request.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './exchange-request-delete-dialog.component.html',
})
export class ExchangeRequestDeleteDialogComponent {
  exchangeRequest?: IExchangeRequest;

  constructor(protected exchangeRequestService: ExchangeRequestService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.exchangeRequestService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
