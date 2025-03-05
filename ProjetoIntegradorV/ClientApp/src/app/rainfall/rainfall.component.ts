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
  dataSource: MatTableDataSource<PeriodicElement>;
  dataSource1: MatTableDataSource<Weather> = new MatTableDataSource<Weather>();
  columnsToDisplay = ['name', 'weight', 'symbol', 'position'];
  columnsToDisplay1 = ['year', 'month', 'averagePrecipitation', 'averageTemperatureC'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay1, 'expand'];
  expandedElement: Weather | null | undefined;
  weatherData: Weather[] = [];
  errorMessage: string = '';
  charts: { [key: number]: Chart } = {};
  pageSize: number = 0;
  pageNo: number = 0;

  constructor(private rainfallService: RainfallService) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

  ngOnInit(): void {
    this.pageSize = 5;
    this.pageNo = 0;
    this.rainfallService.getWeatherData().subscribe(
      (data: Weather[]) => {
        this.weatherData = data;
        this.dataSource1.data = this.weatherData;
        this.dataSource1.paginator = this.paginator;
        console.log('Dados do tempo', this.weatherData);        
      },
      (error: any) => {
        this.errorMessage = `Erro ao obter dados do tempo: ${error.message}`;
        console.error('Erro ao obter dados do tempo', error);
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    debugger;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
      debugger;
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
    debugger;
    if (this.charts[index]) {
      this.charts[index].destroy();
    }
    debugger;
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


interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    name: 'Hydrogen',
    weight: 1.0079,
    symbol: 'H',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`,
  },
  {
    position: 2,
    name: 'Helium',
    weight: 4.0026,
    symbol: 'He',
    description: `Helium is a chemical element with symbol He and atomic number 2. It is a
        colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
        group in the periodic table. Its boiling point is the lowest among all the elements.`,
  },
  {
    position: 3,
    name: 'Lithium',
    weight: 6.941,
    symbol: 'Li',
    description: `Lithium is a chemical element with symbol Li and atomic number 3. It is a soft,
        silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
        lightest solid element.`,
  },
  {
    position: 4,
    name: 'Beryllium',
    weight: 9.0122,
    symbol: 'Be',
    description: `Beryllium is a chemical element with symbol Be and atomic number 4. It is a
        relatively rare element in the universe, usually occurring as a product of the spallation of
        larger atomic nuclei that have collided with cosmic rays.`,
  },
  {
    position: 5,
    name: 'Boron',
    weight: 10.811,
    symbol: 'B',
    description: `Boron is a chemical element with symbol B and atomic number 5. Produced entirely
        by cosmic ray spallation and supernovae and not by stellar nucleosynthesis, it is a
        low-abundance element in the Solar system and in the Earth's crust.`,
  },
  {
    position: 6,
    name: 'Carbon',
    weight: 12.0107,
    symbol: 'C',
    description: `Carbon is a chemical element with symbol C and atomic number 6. It is nonmetallic
        and tetravalent—making four electrons available to form covalent chemical bonds. It belongs
        to group 14 of the periodic table.`,
  },
  {
    position: 7,
    name: 'Nitrogen',
    weight: 14.0067,
    symbol: 'N',
    description: `Nitrogen is a chemical element with symbol N and atomic number 7. It was first
        discovered and isolated by Scottish physician Daniel Rutherford in 1772.`,
  },
  {
    position: 8,
    name: 'Oxygen',
    weight: 15.9994,
    symbol: 'O',
    description: `Oxygen is a chemical element with symbol O and atomic number 8. It is a member of
         the chalcogen group on the periodic table, a highly reactive nonmetal, and an oxidizing
         agent that readily forms oxides with most elements as well as with other compounds.`,
  },
  {
    position: 9,
    name: 'Fluorine',
    weight: 18.9984,
    symbol: 'F',
    description: `Fluorine is a chemical element with symbol F and atomic number 9. It is the
        lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard
        conditions.`,
  },
  {
    position: 10,
    name: 'Neon',
    weight: 20.1797,
    symbol: 'Ne',
    description: `Neon is a chemical element with symbol Ne and atomic number 10. It is a noble gas.
        Neon is a colorless, odorless, inert monatomic gas under standard conditions, with about
        two-thirds the density of air.`,
  },
];
