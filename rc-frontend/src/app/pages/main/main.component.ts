import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FilterComponent } from './filter/filter.component';
import { ServersComponent } from './servers/servers.component';
import { SbiDividerComponent } from '@sbi/design-system';

@Component({
  selector: 'rc-main',
  standalone: true,
  imports: [
    HeaderComponent,
    FilterComponent,
    ServersComponent,
    SbiDividerComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
