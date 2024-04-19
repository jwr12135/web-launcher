export function cssVars(vars: any): Record<string, string> {
  const output: Record<string, string> = {};
  for (const key in vars) {
    if (Object.prototype.hasOwnProperty.call(vars, key)) {
      const value = vars[key];
      if (typeof value === 'object') {
        const nest = cssVars(value);
        for (const nestKey in nest) {
          if (Object.prototype.hasOwnProperty.call(nest, nestKey)) {
            const nestValue = nest[nestKey];
            output[`--${key}-${nestKey.slice(2)}`] = nestValue;
          }
        }
      } else {
        output[`--${key}`] = String(value);
      }
    }
  }
  return output;
}
