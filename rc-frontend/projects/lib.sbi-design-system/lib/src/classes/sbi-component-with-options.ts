import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SbiComponentWithInput } from './sbi-component-with-input.component';
import { SelectableItem } from '../models/selectable-item';
import { CHEVRON_DOWN_ICON_SVG } from '../const/icons';

@Component({
  template: ``
})
export abstract class SbiComponentWithOptions<T> extends SbiComponentWithInput<T> {
  public get chevronIcon() {
    return CHEVRON_DOWN_ICON_SVG;
  }

  @Input() hasDisabledOptions = false;
  @Input() options: SelectableItem<T>[] | null = [];

  @Output() selectionChange: EventEmitter<T> = new EventEmitter<T>();

  public isDisabledOption(option: SelectableItem<T>) {
    if (!this.hasDisabledOptions) {
      return false;
    }
    return Boolean((option as any).disabled);
  }
}
