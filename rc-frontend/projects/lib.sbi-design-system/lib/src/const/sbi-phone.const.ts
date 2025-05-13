export const PHONE_INPUT_MASK_CONFIG: Record<string, string> = {
  standard: '(000) 000-00-00',
  standardNoCharacters: '000 000 00 00',
  work: '(0000) 00-00-00',
  workNoCharacters: '0000 00 00 00'
};

export const PHONE_INPUT_ERROR_MESSAGES: Record<string, string> = {
  required: 'Поле обязательное.',
  minlength: 'Номер должен содержать 11 цифр.',
};
