import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../core/services/flow/layout.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'omla-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(private layoutService: LayoutService) { }

  ngOnInit(): void {
  }

  onFecharMenu(): void {
    this.layoutService.cerrarMenu();
  }
}
