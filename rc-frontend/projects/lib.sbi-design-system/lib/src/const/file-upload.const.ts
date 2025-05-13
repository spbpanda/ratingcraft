import { UploadFileErrors } from '../components/sbi-file-uploader/sbi-file-uploader.models';

export const BASE_FILE_UPLOAD_ERRORS: Record<UploadFileErrors, string> = {
  [UploadFileErrors.fileAlreadyUploaded]: 'Файл уже загружен.',
  [UploadFileErrors.filesLimitExceeded]: 'Превышен максимально допустимое количество файлов.',
  [UploadFileErrors.filesAmountExceeded]: 'Превышен максимально допустимый разер файлов.',
  [UploadFileErrors.invalidFileFormat]: 'Недопустимый формат файла.',
  [UploadFileErrors.fileLimitExceeded]: 'Превышен максимально допустимый разер файла.',
};
