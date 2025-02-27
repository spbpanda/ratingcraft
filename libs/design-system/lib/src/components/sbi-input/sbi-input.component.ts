import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSuffix } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { SbiErrorComponent } from '../sbi-error/sbi-error.component';
import { SbiUppercaseDirective } from '../../directives/sbi-uppercase.directive';
import { SbiNameUppercaseDirective } from '../../directives/sbi-name-uppercase.directive';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { CLEAR_ICON_SVG } from '../../const/icons';
import { SbiComponentWithInput } from '../../classes/sbi-component-with-input.component';
import { PrefixIconType, SuffixIconType } from '../../models/input.types';
import { SbiMultiUppercaseDirective } from '../../directives/sbi-multi-uppercase.directive';

@Component({
  selector: 'sbi-input',
  templateUrl: './sbi-input.component.html',
  styleUrls: ['./sbi-input.component.scss'],
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatInputModule,
    MatSuffix,
    NgxMaskDirective,
    SbiErrorComponent,
    SbiIconComponent,
    SbiUppercaseDirective,
    SbiNameUppercaseDirective,
    SbiMultiUppercaseDirective,
  ],
  providers: [provideNgxMask()],
  standalone: true,
})
export class SbiInputComponent<T> extends SbiComponentWithInput<T> implements OnInit {
  public get clearIcon() {
    return CLEAR_ICON_SVG;
  }

  @Input() maxLength: number | string | null = null;
  @Input() minLength: number | string | null = null;
  @Input() suffixIconType: SuffixIconType = 'clear';
  @Input() prefixIconType: PrefixIconType = 'none';
  @Input() inputUppercaseActive = false;
  @Input() inputNameUppercaseActive = false;
  @Input() ngxMask: string | null = null;
  @Input() ngxSuffix: string = '';
  @Input() ngxPrefix: string = '';
  @Input() ngxPattern: any = null;
  @Input() ngxSeparatorLimit: string = '';
  @Input() dropSpecialCharacters = true;
  @Input() min: number | null = null;
  @Input() max: number | null = null;
  @Input() showErrors: boolean = true;
  @Input() inputMultiUppercaseActive = false;
}
