import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

// Тип для возможных цветов иконки
export type SbiIconColor = 'primary' | 'tertiary' | 'accent' | 'accenttint' | 'warning' | 'error' | 'information' | 'contrast';

// Тип для возможных размеров иконки
export type SbiIconSize = '12' | '16' | '24' | '32' | '48';

/**
 * Компонент иконка
 *
 * Компонент для отображения SVG-иконок из библиотеки.
 *
 * @Component
 * @selector: 'sbi-icon',
 * @standalone: true
 * @templateUrl: './sbi-icon.component.html', 
 * @styleUrl: './sbi-icon.component.scss', 
 */
@Component({
  selector: 'sbi-icon',
  templateUrl: './sbi-icon.component.html', 
  styleUrl: './sbi-icon.component.scss', 
  standalone: true 
})
export class SbiIconComponent implements OnChanges, AfterViewInit {
  // Ссылка на DOM-элемент иконки через ViewChild
  @ViewChild('sbiIcon') private _icon?: ElementRef;

  // SVG-изображение иконки в виде строки
  @Input() iconImage: string = '';

  // Идентификатор для тестирования
  @Input() testId = 'sbi-icon';

  // Размер иконки с фиксированными допустимыми значениями
  @Input() size: SbiIconSize = '24';

  // Цвет иконки (опциональный)
  @Input() color?: SbiIconColor;

  /**
   * Вставляет SVG-изображение в DOM, если оно было передано
   */
  ngAfterViewInit() {
    if (this._icon?.nativeElement && this.iconImage) {
      this._icon.nativeElement.innerHTML = this.iconImage;
    }
  }

  /**
   * Обновляет SVG-изображение при изменении iconImage
   */
  ngOnChanges(changes: SimpleChanges) {
    // Проверяем, изменилось ли свойство iconImage
    if (this._icon?.nativeElement && changes['iconImage'] && changes['iconImage'].currentValue) {
      this._icon.nativeElement.innerHTML = changes['iconImage'].currentValue;
    }
  }
}