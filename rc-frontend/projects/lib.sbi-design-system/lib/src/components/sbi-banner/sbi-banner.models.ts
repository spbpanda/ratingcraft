import { TemplateRef } from '@angular/core';

export interface SbiBannerDataModel {
  isStatic: boolean;
  title?: string;
  content?: TemplateRef<any>;
  context?: unknown;
  contentText?: string;
  appearance: SbiBannerAppearance;
}

export type SbiBannerAppearance = 'info' | 'warn' | 'success';
