import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { CardTypes } from '../../models/card.types';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { STATUS_QUESTION_FILL } from '../../const/icons';
import { SbiCheckboxComponent } from '../sbi-checkbox/sbi-checkbox.component';
import { FormControl } from '@angular/forms';
import { NgClass, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet } from '@angular/common';
import { SbiRadioButtonComponent, SbiRadioButtonOption } from '../sbi-radio-button/sbi-radio-button.component';
import { SbiSlideToggleComponent } from '../sbi-slide-toggle/sbi-slide-toggle.component';
import { SbiBadgeComponent } from '../sbi-badge/sbi-badge.component';
import { BadgeSize, BadgeTypes } from '../../models/badge.types';
import { SbiTooltipDirective } from '../sbi-tooltip/sbi-tooltip.directive';


/**
 * Компонент, отображающий элемент карточки выбора. В основном используется для отображения доп опций или информации о
 * элементе (например транспортном средстве или человеке).
 *
 * Принимает ng-content - active-actions, контейнер, располагающийся в правой части карточки
 *
 * @Component
 * @selector: 'sbi-optional-card'
 * @standalone: true
 * @imports: [SbiIconComponent, SbiCheckboxComponent, NgSwitch, NgTemplateOutlet, NgSwitchCase, SbiRadioButtonComponent, SbiSlideToggleComponent, NgIf, SbiBadgeComponent, NgClass, SbiTooltipDirective]
 * @templateUrl: './sbi-optional-card.component.html'
 * @styleUrl: './sbi-optional-card.component.scss'
 */
@Component({
  selector: 'sbi-optional-card',
  standalone: true,
  imports: [
    SbiIconComponent,
    SbiCheckboxComponent,
    NgSwitch,
    NgTemplateOutlet,
    NgSwitchCase,
    SbiRadioButtonComponent,
    SbiSlideToggleComponent,
    NgIf,
    SbiBadgeComponent,
    NgClass,
    SbiTooltipDirective,
  ],
  templateUrl: './sbi-optional-card.component.html',
  styleUrl: './sbi-optional-card.component.scss',
})
export class SbiOptionalCardComponent implements OnInit {
  /**
   * Значение - выбрана данная карточка или нет. Используется, если не предполагается передача control.
   * @type {boolean | undefined}
   */
  @Input() value?: boolean;

  /**
   * Форм-контроль для управления состоянием карточки.
   * @type {FormControl<boolean | null>}
   */
  @Input() control!: FormControl<boolean | null>;

  /**
   * Флаг, обозначающий активность карточки для нажатия.
   * @type {boolean}
   */
  @Input() static: boolean = false;

  /**
   * Тип активного элемента карточки.
   * @type {'checkbox' | 'radio' | 'switch' | 'icons' | 'illustration'}
   */
  @Input() type: CardTypes = 'checkbox';

  /**
   * Текст, который будет отображаться внутри badge элемента.
   * @type {string}
   */
  @Input() badgeContent: string = '';

  /**
   * Лейбл карточки.
   * @type {string}
   */
  @Input() label: string = '';

  /**
   * Примечание карточки.
   * @type {string | undefined}
   */
  @Input() note?: string;

  /**
   * Показывать или скрыть иконку знака вопроса (при наведении на неё показывается tooltip с описанием).
   * @type {boolean}
   */
  @Input() showInfoIcon: boolean = true;

  /**
   * Идентификатор для тестирования.
   * @type {string}
   */
  @Input() testId: string = 'sbi-optional-card-test-id';

  /**
   * svg код иконки, отображаемой в левой части карточки.
   * @type {string}
   */
  @Input() icon: string = '';

  /**
   * svg код иллюстрации, отображаемой в левой части карточки. Отличие от иконки - размер (у иконки 24px у иллюстрации 44px)
   * @type {string}
   */
  @Input() illustrationIcon: string = '';

  /**
   * Тип, отображаемого badge элемента.
   * @type {'neutral' | 'tint' | 'accent'}
   */
  @Input() badgeType: BadgeTypes = 'accent';

  /**
   * Размер, отображаемого badge элемента.
   * @type {'large' | 'small'}
   */
  @Input() badgeSize: BadgeSize = 'small';

  /**
   * Является ли текст примечания- ссылкой.
   * @type {boolean}
   */
  @Input() isLink: boolean = false;

  /**
   * Скрывать или показывать чекбокс в правой части (используется только в карточках с типом - 'icons' | 'illustration').
   * @type {boolean}
   */
  @Input() showCheckbox: boolean = true;

  /**
   * Расположение отображаемого tooltip (при наведении на иконку знака вопроса).
   * @type {'top' | 'bottom'}
   */
  @Input() tooltipPosition: 'top' | 'bottom' = 'bottom';

  /**
   * Наполнение tooltip-а.
   * @type {string | TemplateRef<any> | null}
   */
  @Input() tooltipContent: string | TemplateRef<any> | null = null;

  /**
   * Размер карточки.
   * @type {'large' | 'small'}
   */
  @Input() size: 'large' | 'small' = 'large';

  /**
   * Событие изменения состояния карточки.
   * @type {EventEmitter()}
   */
  @Output() valueChanged: EventEmitter<void> = new EventEmitter();

  /**
   * Событие нажатия на ссылку - примечание (актуально только при использовании isLink).
   * @type {EventEmitter()}
   */
  @Output() linkClick: EventEmitter<void> = new EventEmitter();

  /**
   * Один элемент для отображения radio button элемента
   */
  public radioOptions: SbiRadioButtonOption[] = [{ label: '', value: true }];

  /**
   * Иконка, отображаемая для вывода примечания.
   */
  public questionIcon = STATUS_QUESTION_FILL;

  ngOnInit() {
    if (this.value !== undefined || this.static) {
      this.control = new FormControl(this.value || false);
    }
  }

  /**
   * Обрабатывает клик на карточку.
   * Вызывает событие `valueChanged`.
   */
  public onCardClick() {
    if (this.type !== 'radio' || !this.control.value) {
      this.control.setValue(!this.control.value);
    }
    this.valueChanged.emit();
  }

  /**
   * Обрабатывает клик на активный элемент выбора карточки (checkbox, radio, switch).
   * Вызывает событие `valueChanged`.
   */
  public onClick() {
    this.valueChanged.emit();
  }

  /**
   * Обрабатывает клик на ссылку (если isLink = true).
   * Вызывает событие `linkClick` с выбранной опцией.
   */
  public onLinkClick() {
    this.linkClick.emit();
  }
}
