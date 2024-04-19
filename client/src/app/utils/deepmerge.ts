// @ts-nocheck

import {isObject} from './isObject';

export function deepmerge<T>(target: T, source: T) {
  const output: T = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    for (const key of Object.keys(source)) {
      if (isObject(source[key])) {
        if (key in target) output[key] = deepmerge(target[key], source[key]);
        else Object.assign(output, {[key]: source[key]});
      } else {
        Object.assign(output, {[key]: source[key]});
      }
    }
  }
  return output;
}
