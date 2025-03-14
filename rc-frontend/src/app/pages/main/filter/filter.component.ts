import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SbiInputComponent, SbiAutocompleteComponent, SbiSuggestChipComponent } from '@sbi/design-system';
import { RcBackendService } from '../../../services/rc-backend.service';
import { take } from 'rxjs';
import { RcButtonComponent } from '../../../components/rc-button/rc-button.component';

@Component({
  selector: 'rc-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SbiInputComponent,
    SbiAutocompleteComponent,
    SbiSuggestChipComponent,
    RcButtonComponent,
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {
  rcBackend = inject(RcBackendService);

  bases: any = this.rcBackend.bases;
  miniGames: any = this.rcBackend.miniGames;
  mods: any = this.rcBackend.mods;
  plugins: any = this.rcBackend.plugins;

  versions: any = this.rcBackend.versions;
  selectedChips: {id:number, value: string}[] = [];

  form = new FormGroup({
    search: new FormControl(''),
    bases: new FormControl([]),
    miniGames: new FormControl([]),
    mods: new FormControl([]),
    plugins: new FormControl([]),
    versions: new FormControl<any>([])
  });

  constructor() {}

  ngOnInit() {
    this.rcBackend.loadBases().pipe(take(1)).subscribe();
    this.rcBackend.loadMiniGames().pipe(take(1)).subscribe();
    this.rcBackend.loadMods().pipe(take(1)).subscribe();
    this.rcBackend.loadPlugins().pipe(take(1)).subscribe();
    this.rcBackend.loadVersions().pipe(take(1)).subscribe();
    this.rcBackend.findServers({}).pipe(take(1)).subscribe();
  }

  findServers() {
    this.rcBackend.findServers(this.form.value).pipe(take(1)).subscribe();
  }

  displayViewValue(val: {id:number, value: string}) {
    return val.value
  }
  

  changeSelected(chip: {id:number, value: string, active: boolean}) {
    chip.active = !chip.active;
    if (this.form.controls.versions.value) {
      if (this.form.controls.versions.value.some((ch: { id: number; value: string; active: boolean; }) => ch === chip)) {
        this.form.controls.versions.setValue(this.form.controls.versions.value.filter((ch: { id: number; value: string; active: boolean; }) => ch !== chip)); 
      } else {
        this.form.controls.versions.setValue([...this.form.controls.versions.value, chip]);
      }
    }
  }
}
