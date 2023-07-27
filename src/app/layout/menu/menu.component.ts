import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/core/services/flow/layout.service';

@Component({
  selector: 'omla-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(private layoutService: LayoutService) { }

  ngOnInit(): void {
  }

  onFecharMenu() {
    this.layoutService.cerrarMenu();
  }
}
