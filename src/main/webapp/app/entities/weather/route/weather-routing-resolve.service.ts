import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IWeather } from '../weather.model';
import { WeatherService } from '../service/weather.service';

@Injectable({ providedIn: 'root' })
export class WeatherRoutingResolveService implements Resolve<IWeather | null> {
  constructor(protected service: WeatherService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IWeather | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((weather: HttpResponse<IWeather>) => {
          if (weather.body) {
            return of(weather.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
