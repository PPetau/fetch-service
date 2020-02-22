export type UrlTemplate = {
  (values: Record<string, string | number>): string;
  raw: string;
};

export function Template(
  strings: TemplateStringsArray,
  ...keys: string[]
): UrlTemplate {
  keys.forEach(key => {
    if (key.length === 0) {
      throw new Error('Keys in the Template can not be emty.');
    }
  });

  const returns = (values: Record<string, string | number>): string => {
    const result = [strings[0]];
    keys.forEach((key, i) => {
      try {
        const value = values[key];
        result.push(value.toString(), strings[i + 1]);
      } catch (ex) {
        throw new Error(`Missing Param: [${key.length > 0 ? key : '<EMPTY>'}]`);
      }
    });
    return result.join('');
  };

  returns.raw = strings.join('');

  return returns;
}
