import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SbiTariffCardComponent } from '../sbi-tariff-card/sbi-tariff-card.component';
import { SbiTariffCard } from '../../models/sbi-tariff-card-group.model';

/**
 * Компонент группы тарифных карточек с возможностью выбора одной или нескольких карт.
 *
 * @Component
 * @selector: 'sbi-tariff-card-group'
 * @standalone: true
 * @imports: [
 *   NgIf,
 *   NgFor,
 *   NgClass,
 *   FormsModule,
 *   SbiTariffCardComponent
 * ]
 * @templateUrl: './sbi-tariff-card-group.component.html'
 * @styleUrl: './sbi-tariff-card-group.component.scss'
 */
@Component({
  selector: 'sbi-tariff-card-group',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    FormsModule,
    SbiTariffCardComponent
  ],
  templateUrl: './sbi-tariff-card-group.component.html',
  styleUrl: './sbi-tariff-card-group.component.scss'
})
export class SbiTariffCardGroupComponent {
  /**
   * @public
   * @description Массив тарифных карточек для отображения.
   * @type {Array<SbiTariffCard>}
   * @defaultValue []
   */
  @Input() public tariffCards: Array<SbiTariffCard> = [];

  /**
   * @public
   * @description Максимальное количество карточек, которые можно выбрать.
   * @type {number}
   * @defaultValue 1
   */
  @Input() public maxSelectable: number = 1;

  /**
   * @public
   * @description Идентификатор для тестирования.
   * @type {string}
   * @defaultValue 'sbi-tariff-card-group-test-id'
   */
  @Input() public testId: string = 'sbi-tariff-card-group-test-id';

  /**
   * @public
   * @description Событие, которое срабатывает при изменении выбранных карточек.
   * @type {EventEmitter<Array<string>>}
   */
  @Output() public selectedCardsChange = new EventEmitter<Array<string>>();

  /**
   * @private
   * @description Массив идентификаторов выбранных карточек.
   * @type {Array<string>}
   */
  private _selectedCardIds: Array<string> = [];

  /**
   * @public
   * @description Получение текущих выбранных карточек.
   * @returns {Array<string>}
   */
  public get selectedCardIds(): Array<string> {
    return this._selectedCardIds;
  }

  /**
   * @public
   * @description Установка выбранных карточек.
   * @param {Array<string>} value - Массив идентификаторов выбранных карточек.
   */
  @Input()
  public set selectedCardIds(value: Array<string>) {
    this._selectedCardIds = value;
  }

  /**
   * @public
   * @description Проверяет, выбрана ли карточка.
   * @param {string} cardId - Идентификатор карточки.
   * @returns {boolean}
   */
  public isCardSelected(cardId: string): boolean {
    return this._selectedCardIds.includes(cardId);
  }

  /**
   * @public
   * @description Обрабатывает клик по карточке.
   * @param {SbiTariffCard} card - Карточка, по которой был клик.
   */
  public handleCardClick(card: SbiTariffCard): void {
    let newSelectedIds: Array<string>;
    
    if (this.isCardSelected(card.id)) {
      // Если карточка уже выбрана, удаляем её из выбранных
      newSelectedIds = this._selectedCardIds.filter(id => id !== card.id);
    } else {
      // Если карточка не выбрана, проверяем, не превышено ли максимальное количество
      if (this._selectedCardIds.length < this.maxSelectable) {
        newSelectedIds = [...this._selectedCardIds, card.id];
      } else if (this.maxSelectable === 1) {
        // Если можно выбрать только одну карточку, заменяем выбранную
        newSelectedIds = [card.id];
      } else {
        // Если превышено максимальное количество и нельзя выбрать ещё карточки, оставляем как есть
        return;
      }
    }
    
    // Обновляем внутреннее состояние
    this._selectedCardIds = newSelectedIds;
    
    // Генерируем событие только при пользовательском взаимодействии
    this.selectedCardsChange.emit(this._selectedCardIds);
  }
} 