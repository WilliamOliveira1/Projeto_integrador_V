import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherForecast } from '../../angular-model/weatherForecast';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  baseApi: string = '';
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.baseApi = baseUrl + 'weatherforecast';
  }

  getWeatherForecast(): Observable<WeatherForecast[]> {
    return this.http.get<WeatherForecast[]>(this.baseApi);
  }
}
