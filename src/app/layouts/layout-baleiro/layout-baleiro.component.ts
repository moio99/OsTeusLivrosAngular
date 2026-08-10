import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-baleiro',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './layout-baleiro.component.html',
  styleUrl: './layout-baleiro.component.scss'
})
export class LayoutBaleiroComponent {
  panelRef: any;
  ngOnInit() {
  }

}
