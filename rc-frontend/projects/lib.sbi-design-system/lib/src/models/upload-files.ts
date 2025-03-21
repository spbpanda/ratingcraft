export enum UploadFileErrors {
  filesLimitExceeded = 'filesLimitExceeded',
  fileLimitExceeded = 'fileLimitExceeded',
  filesAmountExceeded = 'filesAmountExceeded',
  invalidFileFormat = 'invalidFileFormat',
  fileAlreadyUploaded = 'fileAlreadyUploaded',
}

export interface ICustomFile {
  file: File;
  fileId?: string;
  errorMessage?: string;
  isValid?: boolean;
}
