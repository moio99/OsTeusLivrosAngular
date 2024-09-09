import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../core/services/flow/layout.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'omla-header',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private layoutService: LayoutService) { }

  ngOnInit(): void {
  }

  onAmosarMenu(): void {
    this.layoutService.abrirMenu();
  }
}
