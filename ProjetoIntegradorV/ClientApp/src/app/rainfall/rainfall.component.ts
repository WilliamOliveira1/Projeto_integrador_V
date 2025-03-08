import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ChartOptions, ChartType, ChartDataset, Chart, registerables } from 'chart.js';
import { ExportDailyWeather, Weather } from '../../angular-model/weather';
import { RainfallService } from '../../services/rainfall/rainfall.service';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-rainfall',
  templateUrl: './rainfall.component.html',
  styleUrls: ['./rainfall.component.css']
})
export class RainfallComponent {
  @ViewChildren('chartCanvas') chartCanvases!: QueryList<ElementRef>;
  @ViewChild(MatPaginator)
    paginator!: MatPaginator;
  dataSource1: MatTableDataSource<Weather> = new MatTableDataSource<Weather>();
  columnsToDisplay1 = ['year', 'month', 'averagePrecipitation', 'averageTemperatureC'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay1, 'expand'];
  expandedElement: Weather | null | undefined;
  weatherData: Weather[] = [];
  errorMessage: string = '';
  charts: { [key: number]: Chart } = {};
  pageSize: number = 0;
  pageNo: number = 0;

  constructor(private rainfallService: RainfallService) {
  }

  ngOnInit(): void {
    this.pageSize = 5;
    this.pageNo = 0;
    this.rainfallService.getWeatherData().subscribe(
      (data: Weather[]) => {
        this.weatherData = data;
        this.dataSource1.data = this.weatherData;        
        console.log('Dados do tempo', this.weatherData);        
      },
      (error: any) => {
        this.errorMessage = `Erro ao obter dados do tempo: ${error.message}`;
        console.error('Erro ao obter dados do tempo', error);
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource1.paginator = this.paginator;
  }

  pageEvents(event: any) {
    console.log(event.pageIndex);
    console.log(event.pageSize);
    if (event.pageIndex > this.pageNo) {
      // Clicked on next button
    } else {
      // Clicked on previous button
    }
    // The code that you want to execute on clicking on next and previous buttons will be written here.
  }

  /** Checks whether an element is expanded. */
  isExpanded(element: Weather) {
    return this.expandedElement === element;
  }

  /** Toggles the expanded state of an element. */
  toggle(element: Weather) {
    this.expandedElement = this.isExpanded(element) ? null : element;
    if (this.expandedElement) {
      const pageIndex = this.paginator.pageIndex;
      const pageSize = this.paginator.pageSize;      
      const index = this.weatherData.indexOf(this.expandedElement) - (pageIndex * pageSize);
      if (index !== -1 && this.expandedElement.dailyWeatherData) {
        setTimeout(() => this.prepareChartData(this.expandedElement!.dailyWeatherData, index), 0);
      }
    } else {
      const pageIndex = this.paginator.pageIndex;
      const pageSize = this.paginator.pageSize;
      const index = this.weatherData.indexOf(element) - (pageIndex * pageSize);
      this.charts[index]?.destroy();
      delete this.charts[index];
    }
  }

  prepareChartData(dailyWeatherData: ExportDailyWeather[], index: number): void {
    const labels: string[] = [];
    dailyWeatherData.forEach(d => {
      const date = new Date(d.infoDate.toString()).getDate().toString()
      labels.push(date);
    });
    
    const temperatureData = dailyWeatherData.map(d => d.temperatureC);
    const precipitationData = dailyWeatherData.map(d => d.precipitation);
    if (this.charts[index]) {
      this.charts[index].destroy();
    }
    const canvas = this.chartCanvases.toArray()[index].nativeElement;

      this.charts[index] = new Chart(canvas, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Temperatura',
              data: temperatureData,
              borderColor: 'red',
              fill: false
            },
            {
              label: 'Precipitação Pluviométrica',
              data: precipitationData,
              borderColor: 'blue',
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Gráfico comparativo entre temperaturas e precipitações pluviométricas =>50mm entre os anos de 1961 à 2024 na cidade de Sorocaba/SP - INMET(2024)'
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Ano'
              }
            },
            y: {
              beginAtZero: true
            }
          }
        }
      }); 
  }
}
