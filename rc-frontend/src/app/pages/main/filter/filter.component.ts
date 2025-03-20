import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SbiInputComponent, SbiAutocompleteComponent, SbiSuggestChipComponent } from '@sbi/design-system';
import { RcBackendService } from '../../../services/rc-backend.service';
import { take } from 'rxjs';
import { RcButtonComponent } from '../../../components/rc-button/rc-button.component';
import { Item } from '../../../common/interfaces/filter';

@Component({
  selector: 'rc-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SbiInputComponent,
    SbiAutocompleteComponent,
    SbiSuggestChipComponent,
    RcButtonComponent,
    JsonPipe
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {
  @Output() onFindServers = new EventEmitter();
  rcBackend = inject(RcBackendService);

  bases: any = this.rcBackend.bases;
  miniGames: any = this.rcBackend.miniGames;
  mods: any = this.rcBackend.mods;
  plugins: any = this.rcBackend.plugins;

  versions: any = this.rcBackend.versions;
  selectedChips: {id:number, value: string}[] = [];

  form = new FormGroup({
    search: new FormControl<string>(''),
    bases: new FormControl<Item[]>([]),
    miniGames: new FormControl<Item[]>([]),
    mods: new FormControl<Item[]>([]),
    plugins: new FormControl<Item[]>([]),
    versions: new FormControl<Item[]>([])
  });

  constructor() {}

  ngOnInit() {
    this.rcBackend.loadBases().pipe(take(1)).subscribe();
    this.rcBackend.loadMiniGames().pipe(take(1)).subscribe();
    this.rcBackend.loadMods().pipe(take(1)).subscribe();
    this.rcBackend.loadPlugins().pipe(take(1)).subscribe();
    this.rcBackend.loadVersions().pipe(take(1)).subscribe();
  }

  findServers() {
    this.rcBackend.updateFilterDetails(this.form.value)
    this.rcBackend.findServers().pipe(take(1)).subscribe();
  }

  displayViewValue(val: {id:number, value: string}) {
    return val.value
  }
  

  changeSelected(chip: {id:number, value: string, active: boolean}) {
    chip.active = !chip.active;
    if (this.form.controls.versions.value) {
      if (this.form.controls.versions.value.some((ch: Item) => ch === chip)) {
        this.form.controls.versions.setValue(this.form.controls.versions.value.filter((ch: Item) => ch !== chip)); 
      } else {
        this.form.controls.versions.setValue([...this.form.controls.versions.value, chip]);
      }
    }
  }
}
