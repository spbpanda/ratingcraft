import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SbiSwipeService {
  private _actualPopUpModalForm: string[] = [];

  public addPopUpModalName(actualName: string) {
    this._actualPopUpModalForm.push(actualName);
  }

  public removePopUpModalName() {
    this._actualPopUpModalForm.pop();
  }

  public get actualPopUpModalForm() {
    if (this._actualPopUpModalForm.length) {
      return this._actualPopUpModalForm[this.activePupUpsCount() - 1];
    }
    return '';
  }

  public activePupUpsCount() {
    return this._actualPopUpModalForm.length;
  }
}
