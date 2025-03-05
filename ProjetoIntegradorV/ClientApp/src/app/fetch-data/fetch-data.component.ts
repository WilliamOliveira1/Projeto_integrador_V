import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherForecast } from '../../angular-model/weatherForecast';
import { WeatherService } from './fetch-data.service';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  public weatherData: WeatherForecast[] = [];
  errorMessage: string = '';

  constructor(private weatherService: WeatherService) {
  }

  ngOnInit(): void {
    debugger;
    this.weatherService.getWeatherForecast().subscribe(
      (data: WeatherForecast[]) => {
        debugger;
        this.weatherData = data;
        console.log('Dados do tempo', this.weatherData);
      },
      (error: any) => {
        debugger;
        this.errorMessage = `Erro ao obter dados do tempo: ${error.message}`;
        console.error('Erro ao obter dados do tempo', error);
      }
    );
  }
}
