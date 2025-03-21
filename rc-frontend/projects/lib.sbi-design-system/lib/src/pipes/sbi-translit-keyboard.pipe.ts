import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "sbiTranslitKeyboard",
  standalone: true,
})
export class SbiTranslitKeyboardPipe implements PipeTransform {
  /**
   * Транслитерация с английской раскладки на русскую
   * @param value - Текст для транслитерации (латиница -> кириллица)
   * @returns Транслитерированная строка
   */
  transform(value: string): string {
    if (!value) {
      return "";
    }

    const keyboardLayoutMap: { [key: string]: string } = {
      q: 'й', w: 'ц', e: 'у', r: 'к', t: 'е', y: 'н', u: 'г',
      i: 'ш', o: 'щ', p: 'з', '[': 'х', ']': 'ъ', a: 'ф', s: 'ы',
      d: 'в', f: 'а', g: 'п', h: 'р', j: 'о', k: 'л', l: 'д',
      ';': 'ж', "'": 'э', z: 'я', x: 'ч', c: 'с', v: 'м', b: 'и',
      n: 'т', m: 'ь', ',': 'б', '.': 'ю', '/': '.'
    };

    let result = "";

    for (const char of value) {
      const lowerChar = char.toLowerCase();
      if (keyboardLayoutMap[lowerChar]) {
        result +=
          char === lowerChar
            ? keyboardLayoutMap[lowerChar]
            : keyboardLayoutMap[lowerChar].toUpperCase();
      } else {
        result += char;
      }
    }

    return result;
  }
}
