import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { AdaptadorDaData } from './shared/classes/adaptador-data';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, CommonModule, NgApexchartsModule
  ],
  providers: [
    { provide: DateAdapter, useClass: AdaptadorDaData },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
