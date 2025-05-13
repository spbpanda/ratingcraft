import { NgFor } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { SbiRadioButtonGroupFlexDirection, SbiRadioButtonOption } from './sbi-radio-button-group.models';
import { SbiRadioButtonComponent } from '../sbi-radio-button/sbi-radio-button.component';

/**
 * Компонент для отображения группы радио-кнопок с поддержкой лейбла, заметки, ошибок и ссылки.
 *
 * Поддерживает отображение пользовательского контента через ngTemplateOutlet.
 *
 * Принимает ng-content для отображения кастомных элементов.
 *
 * @Component
 * @selector: 'sbi-radio-button-group'
 * @standalone: true
 * @imports: [NgFor, ReactiveFormsModule, MatRadioModule, SbiRadioButtonComponent]
 * @templateUrl: './sbi-radio-button-group.component.html'
 * @styleUrl: './sbi-radio-button-group.component.scss'
 */
@Component({
  selector: 'sbi-radio-button-group',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, MatRadioModule, SbiRadioButtonComponent],
  templateUrl: './sbi-radio-button-group.component.html',
  styleUrl: './sbi-radio-button-group.component.scss',
})
export class SbiRadioButtonGroupComponent implements OnChanges, AfterViewInit, OnDestroy {
  /**
   * @private
   * @readonly
   * @description Контейнер радио группы.
   * @type {ElementRef<HTMLElement>}
   */
  @ViewChild('radioGroup') private readonly radioGroup!: ElementRef<HTMLElement>;

  /**
   * @private
   * @description Список дочерних радио кнопок.
   * @type {Array<Element>}
   * @defaultValue []
   */
  private radioButtons: Array<Element> = [];

  /**
   * @public
   * @description Массив опций для радио-кнопок.
   * @type {Array<SbiRadioButtonOption>}
   * @defaultValue []
   */
  @Input() public options: Array<SbiRadioButtonOption> = [];

  /**
   * @public
   * @description Форм-контроль для управления состоянием выбранной радио-кнопки.
   * @type {FormControl}
   * @defaultValue new FormControl()
   */
  @Input() public control: FormControl = new FormControl();

  /**
   * @public
   * @description Тип расположения radio buttons.
   * @type {'column' | 'row'}
   * @defaultValue 'column'
   */
  @Input() public flexDirection: SbiRadioButtonGroupFlexDirection = 'column';

  /**
   * @public
   * @description Сообщения об ошибках для валидации.
   * @type {Record<string, string> | undefined}
   * @defaultValue undefined
   */
  @Input() public errorMessages?: Record<string, string>;

  /**
   * @public
   * @description Флаг, указывающий, нужно ли показывать ошибки.
   * @type {boolean}
   * @defaultValue true
   */
  @Input() public showErrors: boolean = true;

  /**
   * @public
   * @description Идентификатор для тестирования.
   * @type {string}
   * @defaultValue 'sbi-radio-group'
   */
  @Input() public testId: string = 'sbi-radio-group';

  /**
   * @public
   * @description Событие, которое срабатывает при клике на ссылку (если isLink = true).
   * @type {EventEmitter<SbiRadioButtonOption>}
   */
  @Output() public clickToLink: EventEmitter<SbiRadioButtonOption> = new EventEmitter<SbiRadioButtonOption>();

  ngAfterViewInit() {
    this.flexDirection === 'row' && this.connectChangeFlexDirection();
    if (!this.options.length) {
      this.setRadioButtons();
      this.connectChangeRadioValue();
    }
  }

  /**
   * @private
   * @description Находит и запоминает все дочерние радио кнопки.
   */
  private setRadioButtons() {
    const radioButtons = this.radioGroup.nativeElement.getElementsByTagName('mat-radio-button');
    for (let i = 0; i < radioButtons.length; i++) {
      radioButtons.item(i) && this.radioButtons.push(radioButtons.item(i)!);
    }
  }

  /**
   * @private
   * @description Обрабатывает событие взаимодействия с дочерними радио кнопками.
   */
  private connectChangeRadioValue() {
    this.radioButtons.forEach(elem => elem.addEventListener('click', () => {
      const elementValue = elem.getElementsByTagName('input').item(0)?.value || '';
      const value = ['false', 'true'].includes(elementValue) ? Boolean(elementValue) : elementValue;
      this.control.value !== value && this.control.setValue(value);
    }));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['flexDirection']) {
      const newFlexDirection = changes['flexDirection'];
      if (newFlexDirection.currentValue !== newFlexDirection.previousValue) {
        if (newFlexDirection.currentValue === 'row') {
          this.radioGroup && this.radioGroup.nativeElement && this.connectChangeFlexDirection();
        } else {
          this.removeDetectResize();
        }
      }
    }
  }

  /**
   * @private
   * @description Подписывается на событие изменения размера окна, чтобы динамически менять положение radioButtons.
   **/
  private connectChangeFlexDirection() {
    const elem = this.radioGroup.nativeElement;
    setTimeout(() => this.setFlexDirection(elem), 100)
    window.addEventListener('resize', (event) => {
      this.setFlexDirection(elem);
    })
  }

  /**
   * @private
   * @description Динамически менять положение radioButtons.
   * @param { HTMLElement } elem - Контейнер с radioButtons.
   **/
  private setFlexDirection(elem: HTMLElement): void {
    if (elem.scrollWidth > elem.clientWidth) {
      elem.setAttribute('style', 'flex-direction: column');
    } else if (elem.getAttribute('style') !== `flex-direction: ${this.flexDirection}`) {
      elem.setAttribute('style', `flex-direction: ${this.flexDirection}`);
      this.setFlexDirection(elem);
    }
  }

  /**
   * @public
   * @description Обрабатывает клик на ссылку (если isLink = true).
   * Вызывает событие `clickToLink` с выбранной опцией.
   * @param {SbiRadioButtonOption} option - Опция, на которую был сделан клик.
   */
  public onClickToLink(option: SbiRadioButtonOption) {
    if (option.isLink) {
      this.clickToLink.emit(option);
    }
  }

  ngOnDestroy() {
    this.removeDetectResize();

    this.radioButtons.forEach(elem => elem.removeEventListener('click', () => {
    }));
  }

  /**
   * @private
   * @description Отписываемся от события изменения размеров окна.
   **/
  private removeDetectResize() {
    window.removeEventListener('resize', () => {
    });
  }
}
