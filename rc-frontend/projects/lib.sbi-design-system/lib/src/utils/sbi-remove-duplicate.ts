/**
 * @description Функция удаления дубликатов из массива.
 * @param {Array<T>} params - Массив элементов.
 * @param {keyof T} filterParamName - Параметр по значению которого осуществляется фильтрация.
 * @return Array<T> - Список уникальных элементов.
 * */
export function sbiRemoveDuplicates<T>(params: Array<T>, filterParamName: keyof T): Array<T> {
  const set: Record<string, T> = {};
  params.forEach(param => (set[param[filterParamName] as string] = param));
  return Object.keys(set).map(key => set[key]);
}
