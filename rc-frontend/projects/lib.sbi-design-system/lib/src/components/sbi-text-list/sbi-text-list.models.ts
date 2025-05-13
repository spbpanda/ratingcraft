export interface SbiTextListElement {
  label: string;
  labelClass?: string;
  useBadge?: boolean;
  iconImage?: string;
  iconState?: SbTextListIconState;
}

export type SbTextListIconState = 'active' | 'inactive';
