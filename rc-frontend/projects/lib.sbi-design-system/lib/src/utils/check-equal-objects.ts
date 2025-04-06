import { DateTime } from 'luxon';

function objectToRecord<T extends object>(obj: T) {
  const flattened: Record<string, string> = {};

  function flatten(obj: T, prefix: string = '') {
    for (const [key, value] of Object.entries(obj)) {
      const propName = prefix ? `${prefix}.${key}` : key;
      if (value instanceof DateTime) {
        flattened[propName] = value.toString();
      } else if (typeof value === 'object' && value !== null) {
        flatten(value, propName);
      } else if (['boolean', 'string', 'number'].includes(typeof value)) {
        flattened[propName] = (value as string | number | boolean).toString();
      } else {
        flattened[propName] = value == null ? 'null' : 'undefined';
      }
    }
  }

  flatten(obj);

  return flattened;
}

type EqualTypes = object | string | boolean | number | null | undefined;

export function isEqual(arg1: EqualTypes, arg2: EqualTypes, skipTypes: boolean = false) {
  if (typeof arg1 !== typeof arg2) {
    return false;
  }
  if (typeof arg1 !== 'object' || typeof arg2 !== 'object' || arg1 == null || arg2 == null) {
    return skipTypes ? arg1 == arg2 : arg1 === arg2;
  }

  const flattenObj1 = objectToRecord(arg1);
  const flattenObj2 = objectToRecord(arg2);
  if (Object.keys(flattenObj1).length !== Object.keys(flattenObj2).length) {
    return false;
  }
  for (const [key, value] of Object.entries(flattenObj1)) {
    if (flattenObj2[key] !== value) {
      return false;
    }
  }
  return true;
}

export async function isEqualAsync(arg1: EqualTypes, arg2: EqualTypes, skipTypes: boolean = false) {
  return isEqual(arg1, arg2, skipTypes);
}
