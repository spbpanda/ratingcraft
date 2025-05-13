import { MOON_FILL, SUN_FILL } from '../../const/icons';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, effect, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { SbiFloatingActionButtonComponent } from '../sbi-floating-action-button/sbi-floating-action-button.component';
import { SbiDarkSliderType } from './sbi-dark-slider.model';

/**
 * Компонент смены темы.
 *
 * @Component
 * @selector: 'sbi-dark-slider'
 * @standalone: true
 * @imports: [SbiFloatingActionButtonComponent]
 * @templateUrl: './sbi-dark-slider.component.html'
 * @styleUrl: './sbi-dark-slider.component.scss'
 *  */
@Component({
  selector: 'sbi-dark-slider',
  standalone: true,
  imports: [SbiFloatingActionButtonComponent],
  templateUrl: './sbi-dark-slider.component.html',
  styleUrl: './sbi-dark-slider.component.scss',
})
export class SbiDarkSliderComponent {

  /**
   * @public
   * @description Идентификатор для тестирования.
   * @type {string}
   * @defaultValue 'sbi-dark-slider'
   */
  @Input() public testId: string = 'sbi-dark-slider';

  /**
   * @public
   * @setter
   * @description Входной параметр для управления темой извне.
   * @param {SbiDarkSliderType} mode - Устанавливаемый режим темы.
   */
  @Input()
  public set theme(mode: SbiDarkSliderType) {
    this.isDarkTheme.set(mode === 'dark');
    this.updateThemeClasses();
  }

  /**
   * @public
   * @description Событие изменения темы (для двустороннего связывания).
   * @type {EventEmitter<SbiDarkSliderType>}
   */
  @Output() public themeChange: EventEmitter<SbiDarkSliderType> = new EventEmitter<SbiDarkSliderType>();

  /**
   * @public
   * @description Иконка солнца для светлой темы.
   * @type {string} SVG-строка
   * @defaultValue SUN_FILL
   */
  public readonly sun: string = SUN_FILL;

  /**
   * @public
   * @description Иконка луны для темной темы.
   * @type {string} SVG-строка
   * @defaultValue MOON_FILL
   */
  public readonly moon: string = MOON_FILL;

  /**
   * @public
   * @description Состояние темы (signal для оптимальной производительности).
   * @type {Signal<boolean>}
   * @defaultValue false
   */
  public isDarkTheme: WritableSignal<boolean> = signal<boolean>(false);

  constructor(private overlayContainer: OverlayContainer) {
    // Инициализация темы из localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkTheme.set(savedTheme === 'dark');
    }

    /**
     * Реактивный эффект для автоматического изменения темы:
     * 1. Обновляет CSS-классы;
     * 2. Генерирует событие изменения темы.
     */
    effect(() => {
      this.updateThemeClasses();
      this.themeChange.emit(this.isDarkTheme() ? 'dark' : 'light');
    });
  }

  /**
   * @public
   * @description Переключает тему между светлой и темной.
   * @returns {void}
   */
  public toggleTheme(): void {
    this.isDarkTheme.update(value => {
      const newValue = !value;
      localStorage.setItem('theme', newValue ? 'dark' : 'light');
      return newValue;
    });
  }

  /**
   * @private
   * @description Обновляет CSS-классы на overlay-контейнере и body.
   */
  private updateThemeClasses(): void {
    const isDark = this.isDarkTheme();
    const overlayClassList = this.overlayContainer.getContainerElement().classList;
    const bodyClassList = document.body.classList;

    isDark ? overlayClassList.add('dark-theme') : overlayClassList.remove('dark-theme');
    isDark ? bodyClassList.add('dark-theme') : bodyClassList.remove('dark-theme');
  }
}
