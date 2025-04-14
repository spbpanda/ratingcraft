import { Component, ContentChild, Input, TemplateRef, ViewChild, } from '@angular/core';

/**
 * Компонент для отображения отдельной вкладки в группе вкладок SbiTabGroup.
 *
 * Поддерживает установку текстовой метки или кастомного шаблона для метки,
 * а также различные размеры и возможность отключения.
 *
 * Принимает ng-content для отображения контента.
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
   * Внешний вид вкладки.
   * - 'default': Стандартный вид на светлом фоне (по умолчанию)
   * - 'overlay': Вид с адаптацией для темного фона
   * @type {'default' | 'overlay'}
   */
  @Input() appearance: 'default' | 'overlay' = 'default';

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
