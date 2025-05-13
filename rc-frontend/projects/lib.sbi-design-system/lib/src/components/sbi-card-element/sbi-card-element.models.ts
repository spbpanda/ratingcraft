/**
 * @deprecated Нужно использовать SbiCardElementInfoItem
 * */
export interface InfoItem {
  title: string;
  note: string;
  notePipe?: unknown;
  noteArgs?: Array<unknown>;
  titlePipe?: unknown;
  titleArgs?: Array<unknown>;
}

export interface SbiCardElementInfoItem extends InfoItem {
}
