import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  ContentChild,
} from '@angular/core';

@Component({
  selector: 'sbi-tab',
  standalone: true,
  templateUrl: './sbi-tab.component.html',
  styleUrls: ['./sbi-tab.component.scss'],
})
export class SbiTabComponent {
  @Input() size: 'large' | 'small' = 'large';
  @Input() testId: string = 'sbiTab';
  @Input() label: string = ''; // Обычный текстовый label
  @Input() disabled: boolean = false;

  @ViewChild('templateRef') templateRef!: TemplateRef<any>; // Содержимое вкладки
  @ContentChild('sbiTabLabel', { read: TemplateRef }) customLabel: TemplateRef<any> | null = null; // Кастомный label
}
