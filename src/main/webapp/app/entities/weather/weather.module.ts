import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { WeatherComponent } from './list/weather.component';
import { WeatherDetailComponent } from './detail/weather-detail.component';
import { WeatherUpdateComponent } from './update/weather-update.component';
import { WeatherDeleteDialogComponent } from './delete/weather-delete-dialog.component';
import { WeatherRoutingModule } from './route/weather-routing.module';

@NgModule({
  imports: [SharedModule, WeatherRoutingModule],
  declarations: [WeatherComponent, WeatherDetailComponent, WeatherUpdateComponent, WeatherDeleteDialogComponent],
})
export class WeatherModule {}
