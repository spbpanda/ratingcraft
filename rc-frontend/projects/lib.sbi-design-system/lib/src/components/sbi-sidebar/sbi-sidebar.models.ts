import { SbiTooltipContent, SbiTooltipPosition } from '../sbi-tooltip/sbi-tooltip.models';

export interface SbiSidebarPriceElement {
  value: number;
  pipe?: unknown;
  pipeArgs?: Array<unknown>;
}

export interface SbiSidebarMainElement {
  label: string;
  note: string | Array<string>;
  tooltip?: SbiTooltipContent;
  tooltipPosition?: SbiTooltipPosition;
  pipe?: unknown;
  pipeArgs?: Array<unknown>;
  labelPipe?: unknown;
  labelPipeArgs?: Array<unknown>;
}


export interface SbiSidebarDynamicSumConfiguration {
  isFloat?: boolean,
  duration?: number,
  tickDelay?: number,
}
