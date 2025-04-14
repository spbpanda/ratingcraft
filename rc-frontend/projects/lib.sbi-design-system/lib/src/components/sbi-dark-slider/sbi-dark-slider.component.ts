import { MOON_FILL, SUN_FILL } from './../../const/icons';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, effect, EventEmitter, Input, Output, signal } from '@angular/core';
import { SbiFloatingActionButtonComponent } from '../sbi-floating-action-button/sbi-floating-action-button.component';

// Тип для тем
export type SbiDarkSliderType = 'light' | 'dark';

@Component({
  selector: 'sbi-dark-slider',
  standalone: true,
  imports: [
    SbiFloatingActionButtonComponent
  ],
  templateUrl: './sbi-dark-slider.component.html',
  styleUrl: './sbi-dark-slider.component.scss',
})
export class SbiDarkSliderComponent {
  /**
   * Иконка солнца для светлой темы
   * @type {string} SVG-строка
   */
  readonly sun = SUN_FILL;
  /**
   * Иконка луны для темной темы
   * @type {string} SVG-строка
   */
  readonly moon = MOON_FILL;

  /**
   * Состояние темы (signal для оптимальной производительности)
   * @type {Signal<boolean>}
   * @private
   */
  isDarkTheme = signal<boolean>(false);

  /**
   * Идентификатор для тестирования
   * @type {string}
   * @default 'sbi-dark-slider'
   */
  @Input() testId = 'sbi-dark-slider';
  /**
   * Входной параметр для управления темой извне
   * @param {SbiDarkSliderType} mode - Устанавливаемый режим темы
   */
  @Input() set theme(mode: SbiDarkSliderType) {
    this.isDarkTheme.set(mode === 'dark');
    this.updateThemeClasses();
  }
  /**
   * Событие изменения темы (для двустороннего связывания)
   * @type {EventEmitter<SbiDarkSliderType>}
   */
  @Output() themeChange = new EventEmitter<SbiDarkSliderType>();

  constructor(private overlayContainer: OverlayContainer) {
    // Инициализация темы из localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkTheme.set(savedTheme === 'dark');
    }

    /**
     * Реактивный эффект для автоматического изменения темы:
     * 1. Обновляет CSS-классы
     * 2. Генерирует событие изменения темы
     */
    effect(() => {
      this.updateThemeClasses();
      this.themeChange.emit(this.isDarkTheme() ? 'dark' : 'light');
    });
  }

  /**
   * Переключает тему между светлой и темной
   * @returns {void}
   */
  toggleTheme(): void {
    this.isDarkTheme.update(value => {
      const newValue = !value;
      localStorage.setItem('theme', newValue ? 'dark' : 'light');
      return newValue;
    });
  }
  
  /**
   * Обновляет CSS-классы на overlay-контейнере и body
   * @private
   * @returns {void}
   */
  private updateThemeClasses(): void {
    const isDark = this.isDarkTheme();
    const overlayClassList = this.overlayContainer.getContainerElement().classList;
    const bodyClassList = document.body.classList;
    
    isDark ? overlayClassList.add('dark-theme') : overlayClassList.remove('dark-theme');
    isDark ? bodyClassList.add('dark-theme') : bodyClassList.remove('dark-theme');
  }
}
