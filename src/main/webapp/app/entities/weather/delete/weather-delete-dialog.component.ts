import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IWeather } from '../weather.model';
import { WeatherService } from '../service/weather.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './weather-delete-dialog.component.html',
})
export class WeatherDeleteDialogComponent {
  weather?: IWeather;

  constructor(protected weatherService: WeatherService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.weatherService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
