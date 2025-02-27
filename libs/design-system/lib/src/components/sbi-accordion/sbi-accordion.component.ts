import { Component, Input } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'sbi-accordion',
  standalone: true,
  imports: [
    MatExpansionModule
  ],
  templateUrl: './sbi-accordion.component.html',
  styleUrl: './sbi-accordion.component.scss'
})
export class SbiAccordionComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() icon: string = '';
  @Input() testId: string = 'sbiAccordion';

}
