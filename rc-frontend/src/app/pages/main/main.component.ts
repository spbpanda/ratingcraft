import { Component, inject, signal } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FilterComponent } from './filter/filter.component';
import { ServersComponent } from './servers/servers.component';
import { SbiDividerComponent } from '@sbi/design-system';
import { BehaviorSubject, take } from 'rxjs';
import { RcBackendService } from '../../services/rc-backend.service';
import { Paginator } from '../../common/interfaces/paginator';
import { Filter } from '../../common/interfaces/filter';

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
  rcBackend = inject(RcBackendService);

  ngOnInit() {    
    this.rcBackend.findServers().pipe(take(1)).subscribe();
  }
}
