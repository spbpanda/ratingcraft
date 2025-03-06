import { Component, Input } from '@angular/core';

@Component({
  selector: 'rc-button',
  standalone: true,
  imports: [],
  templateUrl: './rc-button.component.html',
  styleUrl: './rc-button.component.scss'
})
export class RcButtonComponent {
  @Input() type: 'default' | 'submit' | 'warning' | 'error' = 'default';

}
