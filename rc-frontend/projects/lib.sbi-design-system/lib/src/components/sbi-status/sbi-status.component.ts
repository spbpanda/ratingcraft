import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgIf } from '@angular/common';
import { SbiStatusAppearanceType, SbiStatusModels } from './sbi-status.models';
import {
  EXCLAMATION_MARK_SVG_ICON,
  INFO_MARK_SVG_ICON,
  QUESTION_MARK_SVG_ICON,
  SUCCESS_MARK_SVG_ICON
} from '../../const/icons';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { SbiIconColor } from '../sbi-icon/sbi-icon.models';

/**
 * Компонент для отображения статусного индикатора с иконкой и текстом.
 *
 * Поддерживает различные типы и внешний вид для разных статусов (информация, успех, предупреждение, ошибка и др.).
 * Автоматически подбирает соответствующую иконку для каждого статуса, если не указана пользовательская.
 *
 * Принимает ng-content для отображения контента.
 *
 * @Component
 * @selector: 'sbi-status'
 * @standalone: true
 * @imports: [NgIf, SbiIconComponent]
 * @templateUrl: 'sbi-status.component.html'
 * @styleUrls: ['sbi-status.component.scss']
 */
@Component({
  selector: 'sbi-status',
  templateUrl: 'sbi-status.component.html',
  styleUrls: ['sbi-status.component.scss'],
  standalone: true,
  imports: [NgIf, SbiIconComponent],
})
export class SbiStatusComponent implements OnInit, OnChanges {
  /**
   * @public
   * @description Иконка по умолчанию для текущего статуса.
   * @type {string}
   * @defaultValue ''
   */
  public defaultIcon: string = '';

  /**
   * @public
   * @description Текстовая метка статуса.
   * @type {string | undefined}
   * @defaultValue undefined
   */
  @Input() public label?: string;

  /**
   * @public
   * @description Тип статуса, влияющий на стиль отображения.
   * @type {'primary' | 'secondary'}
   * @defaultValue 'primary'
   */
  @Input() public type: SbiStatusModels = 'primary';

  /**
   * @public
   * @description Внешний вид статуса (info, success, warning, error, neutral).
   * @type {'warning' | 'info' | 'error' | 'neutral' | 'success'}
   * @defaultValue 'info'
   */
  @Input() public appearance: SbiStatusAppearanceType = 'info';

  /**
   * @public
   * @description Пользовательская иконка статуса. Если не указана, используется иконка по умолчанию.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public icon: string = '';

  /**
   * @public
   * @description Флаг, указывающий, отображать ли иконку статуса.
   * @type {boolean}
   * @defaultValue true
   */
  @Input() public showIcon: boolean = true;

  /**
   * @description Инициализирует компонент и устанавливает иконку по умолчанию, если пользовательская не указана.
   */
  ngOnInit() {
    !this.icon && this.setDefaultIcon();
  }

  /**
   * @description Обрабатывает изменения входных свойств.
   * Обновляет иконку по умолчанию при изменении соответствующих свойств.
   * @param {SimpleChanges} changes - Объект с изменениями входных свойств.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['icon'] && !changes['icon'].currentValue) {
      this.setDefaultIcon();
    }
    if (!this.icon && changes['appearance']) {
      this.setDefaultIcon();
    }
  }

  /**
   * @private
   * @description Устанавливает иконку по умолчанию в зависимости от выбранного внешнего вида статуса.
   */
  private setDefaultIcon() {
    switch (this.appearance) {
      case 'warning':
        this.defaultIcon = QUESTION_MARK_SVG_ICON;
        break;
      case 'info':
        this.defaultIcon = INFO_MARK_SVG_ICON;
        break
      case 'success':
        this.defaultIcon = SUCCESS_MARK_SVG_ICON;
        break
      case 'neutral':
        this.defaultIcon = INFO_MARK_SVG_ICON;
        break
      case 'error':
        this.defaultIcon = EXCLAMATION_MARK_SVG_ICON;
        break;
    }
  }

  /**
   * @public
   * @getter
   * @description Устанавливает цвет иконки.
   * @return {'primary' | 'tertiary' | 'accent' | 'accenttint' | 'warning' | 'error' | 'information' | 'contrast' | undefined} - цвет иконки
   */
  public get getIconColor(): SbiIconColor | undefined {
    if (this.appearance === 'warning') {
      return 'warning';
    }
    if (this.appearance === 'info') {
      return 'information';
    }
    if (this.appearance === 'error') {
      return 'error';
    }
    if (this.appearance === 'neutral') {
      return 'tertiary';
    }
    if (this.appearance === 'success') {
      return 'accent';
    }
    return undefined;
  }
}
