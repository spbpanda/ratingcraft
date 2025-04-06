import { TemplateRef } from '@angular/core';

export interface SideBarMainElement {
  label: string;
  note: string | string[];
  tooltip?: TemplateRef<any> | string | null;
  tooltipPosition?: 'bottom' | 'top' | 'left' | 'right';
  pipe?: any;
  pipeArgs?: any[];
}
