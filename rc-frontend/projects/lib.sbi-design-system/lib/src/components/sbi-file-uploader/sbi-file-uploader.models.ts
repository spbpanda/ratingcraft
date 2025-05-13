export enum UploadFileErrors {
  filesLimitExceeded = 'filesLimitExceeded',
  fileLimitExceeded = 'fileLimitExceeded',
  filesAmountExceeded = 'filesAmountExceeded',
  invalidFileFormat = 'invalidFileFormat',
  fileAlreadyUploaded = 'fileAlreadyUploaded',
}

/**
 * @deprecated Нужно использовать SbiCustomFile
 * */
export interface ICustomFile {
  file: File;
  fileId?: string;
  errorMessage?: string;
  isValid?: boolean;
}

export interface SbiCustomFile extends ICustomFile {
}
