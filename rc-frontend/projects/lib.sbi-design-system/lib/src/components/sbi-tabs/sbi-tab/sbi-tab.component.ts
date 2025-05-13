import { Component, ContentChild, Input, TemplateRef, ViewChild, } from '@angular/core';
import { SbiTabAppearance, SbiTabSize } from './sbi-tab.models';

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
   * @public
   * @deprecated Размер вкладки ('large' или 'small').
   * @type {'large' | 'small'}
   * @defaultValue 'large'
   */
  @Input() public size: SbiTabSize = 'large';

  /**
   * @public
   * @description Внешний вид вкладки.
   * - 'default': Стандартный вид на светлом фоне (по умолчанию);
   * - 'overlay': Вид с адаптацией для темного фона.
   * @type {'default' | 'overlay'}
   * @defaultValue 'default'
   */
  @Input() public appearance: SbiTabAppearance = 'default';

  /**
   * @public
   * @description Текстовая метка вкладки.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public label: string = '';

  /**
   * @public
   * @description Флаг, указывающий, отключена ли вкладка.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public disabled: boolean = false;

  /**
   * @public
   * @description Идентификатор для тестирования.
   * @type {string}
   * @defaultValue 'sbiTab'
   */
  @Input() public testId: string = 'sbiTab';

  /**
   * @public
   * @description Ссылка на шаблон содержимого вкладки.
   * @type {TemplateRef<any>}
   */
  @ViewChild('templateRef') public templateRef!: TemplateRef<any>;

  /**
   * @public
   * @description Ссылка на кастомный шаблон метки вкладки, если он предоставлен.
   * @type {TemplateRef<any> | null}
   */
  @ContentChild('sbiTabLabel', { read: TemplateRef }) public customLabel: TemplateRef<any> | null = null;
}
