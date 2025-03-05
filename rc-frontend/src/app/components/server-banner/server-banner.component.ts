import { Component, Input } from '@angular/core';
import { Server } from '../../common/interfaces/server';
import { NgIf } from '@angular/common';

@Component({
  selector: 'rc-server-banner',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './server-banner.component.html',
  styleUrl: './server-banner.component.scss'
})
export class ServerBannerComponent {
  @Input() index!: number;
  @Input() server!: Server;

}
