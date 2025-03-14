import { Component } from '@angular/core';
import { LoginComponent } from '../../../components/login/login.component';

@Component({
  selector: 'rc-header',
  standalone: true,
  imports: [
    LoginComponent

  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
