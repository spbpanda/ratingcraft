import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  ContentChild,
} from '@angular/core';

/**
 * Компонент для отображения отдельной вкладки в группе вкладок SbiTabGroup.
 * 
 * Поддерживает установку текстовой метки или кастомного шаблона для метки,
 * а также различные размеры и возможность отключения.
 *
 * @Component
 * @selector: 'sbi-tab'
 * @standalone: true
 * @templateUrl: './sbi-tab.component.html'
 * @styleUrls: ['./sbi-tab.component.scss']
 */
@Component({
  selector: 'sbi-tab',
  standalone: true,
  templateUrl: './sbi-tab.component.html',
  styleUrls: ['./sbi-tab.component.scss'],
})
export class SbiTabComponent {
  /**
   * Размер вкладки ('large' или 'small').
   * @type {'large' | 'small'}
   */
  @Input() size: 'large' | 'small' = 'large';

  /**
   * Идентификатор для тестирования.
   * @type {string}
   */
  @Input() testId: string = 'sbiTab';

  /**
   * Текстовая метка вкладки.
   * @type {string}
   */
  @Input() label: string = ''; // Обычный текстовый label

  /**
   * Флаг, указывающий, отключена ли вкладка.
   * @type {boolean}
   */
  @Input() disabled: boolean = false;

  /**
   * Ссылка на шаблон содержимого вкладки.
   * @type {TemplateRef<any>}
   */
  @ViewChild('templateRef') templateRef!: TemplateRef<any>; // Содержимое вкладки

  /**
   * Ссылка на кастомный шаблон метки вкладки, если он предоставлен.
   * @type {TemplateRef<any> | null}
   */
  @ContentChild('sbiTabLabel', { read: TemplateRef }) customLabel: TemplateRef<any> | null = null; // Кастомный label
}
