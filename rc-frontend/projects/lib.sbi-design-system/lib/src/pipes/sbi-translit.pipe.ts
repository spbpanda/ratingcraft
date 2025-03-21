import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sbiTranslit',
  standalone: true,
})
export class SbiTranslitPipe implements PipeTransform {
  /**
   * Транслит по правилам яндекса https://yandex.ru/support/nmaps/app_transliteration.html
   * @param value - Текст для транслитерации (латиница -> кириллица)
   * @param separator - Разделитель (по умолчанию '_')
   * @returns Транслитерированная строка
   */
  transform(value: string, separator: string = '_'): string {
    if (!value) {
      return '';
    }
    
    // Сначала обрабатываем многосимвольные комбинации
    let result = value.toLowerCase();
    
    // Заменяем специальные символы на разделитель
    result = result.replace(/[^a-zA-Z0-9а-яёА-ЯЁ_]+/g, separator);
    // Удаляем разделители в начале и конце строки
    result = result.replace(new RegExp('^' + separator + '|' + separator + '$', 'g'), '');
    
    // Заменяем многосимвольные транслитерации
    const multiCharReplacements = [
      { from: 'yo', to: 'ё' },
      { from: 'zh', to: 'ж' },
      { from: 'kh', to: 'х' },
      { from: 'ts', to: 'ц' },
      { from: 'ch', to: 'ч' },
      { from: 'sh', to: 'ш' },
      { from: 'sch', to: 'щ' },
      { from: 'yu', to: 'ю' },
      { from: 'ya', to: 'я' },
      { from: 'ye', to: 'е' },
      { from: 'iy', to: 'ый' }
    ];
    
    // Применяем правила для многосимвольных комбинаций
    for (const replacement of multiCharReplacements) {
      const regex = new RegExp(replacement.from, 'g');
      result = result.replace(regex, replacement.to);
    }
    
    // Теперь заменяем односимвольные транслитерации, избегая уже замененных
    const singleCharMap: { [key: string]: string } = {
      'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д',
      'e': 'е', 'z': 'з', 'i': 'и', 'j': 'й', 'k': 'к',
      'l': 'л', 'm': 'м', 'n': 'н', 'o': 'о', 'p': 'п',
      'r': 'р', 's': 'с', 't': 'т', 'u': 'у', 'f': 'ф',
      'h': 'х', 'c': 'ц', 'y': 'ы'
    };
    
    // Сохраняем регистр букв
    let finalResult = '';
    for (let i = 0; i < result.length; i++) {
      const char = result[i];
      if (singleCharMap[char]) {
        // Если это буква для транслитерации, проверяем регистр
        const originalChar = value[i] ? value[i].toLowerCase() : '';
        const charIndex = value.toLowerCase().indexOf(originalChar, i);
        const originalCaseChar = charIndex >= 0 ? value[charIndex] : '';
        
        if (originalCaseChar && originalCaseChar === originalCaseChar.toUpperCase() && /[A-Z]/.test(originalCaseChar)) {
          finalResult += singleCharMap[char].toUpperCase();
        } else {
          finalResult += singleCharMap[char];
        }
      } else {
        // В противном случае оставляем как есть
        finalResult += result[i];
      }
    }
    
    return finalResult;
  }
} 