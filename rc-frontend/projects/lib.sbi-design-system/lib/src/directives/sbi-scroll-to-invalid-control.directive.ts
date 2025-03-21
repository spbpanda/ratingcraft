import { Directive, ElementRef, HostListener } from '@angular/core';
import { FormArray, FormGroup, FormGroupDirective } from '@angular/forms';

/**
 * Директива для автоматической прокрутки к первому невалидному контролу формы.
 * 
 * При отправке формы автоматически прокручивает страницу к первому невалидному контролу,
 * что улучшает UX при валидации форм. Также помечает все контролы как "touched" для
 * отображения всех ошибок валидации.
 *
 * @Directive
 * @selector: '[sbiScrollToInvalidControl]'
 * @standalone: true
 */
@Directive({
  selector: '[sbiScrollToInvalidControl]',
  standalone: true
})
export class SbiScrollToInvalidControlDirective {

  /**
   * Конструктор с ElementRef и FormGroupDirective для работы с DOM и формой.
   * 
   * @param {ElementRef} el - Ссылка на DOM-элемент директивы
   * @param {FormGroupDirective} formGroup - Директива формы для доступа к контролам
   */
  constructor(private el: ElementRef, private formGroup: FormGroupDirective) {
  }

  /**
   * Обработчик события отправки формы (ngSubmit).
   * Помечает все контролы как "touched" и прокручивает к первому невалидному контролу.
   */
  @HostListener('ngSubmit')
  public onSubmit() {
    this.touchMe(this.formGroup.control);

    if (this.formGroup.control.invalid) {
      if (this.allControlsIsValid()) {
        this.scrollToFirstElement();
      } else {
        this.scrollToFirstInvalidControl();
      }
    }
  }

  /**
   * Прокручивает страницу к первому невалидному контролу.
   * Ищет первый элемент с классом 'ng-invalid' и прокручивает к нему.
   * @private
   */
  private scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector('.ng-invalid');

    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({behavior: 'smooth', block: 'center'});
    }
  }

  /**
   * Рекурсивно помечает все контролы формы как "dirty" и "touched".
   * Обрабатывает вложенные FormGroup и FormArray.
   * 
   * @param {FormGroup} group - Группа контролов для обработки
   * @private
   */
  private touchMe(group: FormGroup): void {
    Object.values(group.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.touchMe(control);
      }
      if (control instanceof FormArray) {
        control.controls.forEach(group => {
          if (group instanceof FormGroup) {
            this.touchMe(group);
          }
        });
      }
      control.markAsDirty();
      control.markAsTouched();
    })
  }

  /**
   * Проверяет, все ли контролы формы валидны.
   * 
   * @returns {boolean} - true, если все контролы валидны, иначе false
   * @private
   */
  private allControlsIsValid() {
    const controls = this.formGroup.form.controls;
    return Object.values(controls).map(control => control.valid).filter(valid => !valid).length === 0;
  }

  /**
   * Прокручивает страницу к первому элементу формы.
   * Используется, когда все контролы валидны, но форма помечена как невалидная.
   * @private
   */
  private scrollToFirstElement() {
    this.el.nativeElement.children.item(0)?.scrollIntoView({behavior: 'smooth', block: 'center'})
  }
}
