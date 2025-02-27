import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { SbiChipComponent } from '../sbi-chip/sbi-chip.component';

@Component({
  selector: 'sbi-chip-row',
  templateUrl: './sbi-chip-row.component.html',
  styleUrls: ['sbi-chip-row.component.scss'],
  standalone: true,
  imports: [SbiChipComponent],
})
export class SbiChipRowComponent<T> implements OnInit, OnChanges {
  @ViewChild('sbiChipRow') public sbiChipRow!: ElementRef<HTMLDivElement>;

  @Input() control!: FormControl<T[] | null>;
  @Input() value?: T[];
  @Input() selectedChips: T[] = [];
  @Input() displayFn: (value: T) => string = value => JSON.stringify(value);
  @Input() compareFn: (elem1: T, elem2: T) => boolean = (elem1, elem2) =>
    JSON.stringify(elem1) === JSON.stringify(elem2);
  @Input() disabled = false;
  @Input() chipShowClearIcon = true;
  @Input() testId = 'sbi-chip-row';

  @Output() clearChipEvent = new EventEmitter<Event>();
  @Output() clickChipEvent = new EventEmitter<T>();
  @Output() removeChipEvent = new EventEmitter<T>();

  ngOnInit() {
    if (this.value) {
      this.control = new FormControl(this.value);
    }
    if (this.disabled && this.control) {
      this.control.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (Object.prototype.hasOwnProperty.call(changes, 'disabled')) {
      if (changes['disabled'].currentValue) {
        this.control.disable();
      } else {
        this.control.enable();
      }
    }
    if (changes['value']) {
      this.control = new FormControl(changes['value'].currentValue);
    }
  }

  public onClearChip(event: Event, chip: T) {
    this.clearChipEvent.emit(event);
    this.removeChipEvent.emit(chip);

    const value = this.control.value ?? [];
    const newValue = value.filter(elem => !this.compareFn(elem, chip));
    this.control.setValue(newValue);
  }

  public chipIsSelected(chip: T) {
    return this.selectedChips.some(elem => this.compareFn(elem, chip));
  }

  public onClickChipEvent(chip: T) {
    this.clickChipEvent.emit(chip);
  }
}
