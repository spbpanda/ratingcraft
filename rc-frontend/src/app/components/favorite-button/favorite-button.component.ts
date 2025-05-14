import { Component, inject, Input } from '@angular/core';
import { RcButtonComponent } from '../rc-button/rc-button.component';
import { RcBackendService } from '../../services/rc-backend.service';

@Component({
  selector: 'rc-favorite-button',
  standalone: true,
  imports: [
    RcButtonComponent,

  ],
  templateUrl: './favorite-button.component.html',
  styleUrl: './favorite-button.component.scss'
})
export class FavoriteButtonComponent {
  rcBackend = inject(RcBackendService);

  get isFavorite(): boolean {
    return this.rcBackend.isServerFavorite(this.serverId);
  }
  @Input() serverId: string = '';

  toggleFavorite() {
    if (this.isFavorite) {
      this.rcBackend.removeFavoriteServer(this.serverId).subscribe();
    } else {
      this.rcBackend.addFavoriteServer(this.serverId).subscribe();
    }
  }
}
