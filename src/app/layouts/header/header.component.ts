import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../core/services/flow/layout.service';
import { MatIconModule } from '@angular/material/icon';
import { CarregandoService } from '../../core/services/tools/carregando.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'omla-header',
  standalone: true,
  imports: [MatIconModule, CommonModule], // engado CommonModule para o | async do HTML
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAmosarCarregando$!: Observable<boolean>;

  constructor(
    private layoutService: LayoutService,
    private carregandoService: CarregandoService
  ) {
    this.isAmosarCarregando$ = this.carregandoService.carregando$;
  }

  ngOnInit(): void {
  }

  onAmosarMenu(): void {
    this.layoutService.abrirMenu();
  }
}
