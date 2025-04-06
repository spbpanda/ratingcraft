import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgIf } from '@angular/common';
import { StatusAppearanceTypes, StatusTypes } from '../../models/status.types';
import {
  EXCLAMATION_MARK_SVG_ICON,
  INFO_MARK_SVG_ICON,
  QUESTION_MARK_SVG_ICON,
  SUCCESS_MARK_SVG_ICON
} from '../../const/icons';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';

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
   * Иконка по умолчанию для текущего статуса.
   * @type {string}
   */
  public defaultIcon = '';

  /**
   * Текстовая метка статуса.
   * @type {string | undefined}
   */
  @Input() label?: string;

  /**
   * Тип статуса, влияющий на стиль отображения.
   * @type {StatusTypes}
   */
  @Input() type: StatusTypes = 'primary';

  /**
   * Внешний вид статуса (info, success, warning, error, neutral).
   * @type {StatusAppearanceTypes}
   */
  @Input() appearance: StatusAppearanceTypes = 'info';

  /**
   * Пользовательская иконка статуса. Если не указана, используется иконка по умолчанию.
   * @type {string}
   */
  @Input() icon: string = '';

  /**
   * Флаг, указывающий, отображать ли иконку статуса.
   * @type {boolean}
   */
  @Input() showIcon = true;

  /**
   * Инициализирует компонент и устанавливает иконку по умолчанию, если пользовательская не указана.
   */
  ngOnInit() {
    !this.icon && this.setDefaultIcon();
  }

  /**
   * Обрабатывает изменения входных свойств.
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
   * Устанавливает иконку по умолчанию в зависимости от выбранного внешнего вида статуса.
   * @private
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
}
