export type UrlTemplate = {
  (values: Record<string, string | number>, ctx: TemplateContext): string;
  raw: string;
};

type TemplateContext = {
  target: object;
  key: string;
};

export interface Replacer {
  regx: RegExp;
  with: (ctx: TemplateContext) => string;
}

export const TemplateReplacer = new (class TemplateReplacer {
  public readonly replacers: Replacer[] = [];

  public constructor() {
    this.addReplacer({
      regx: /(\[SERVICE\])/gi,
      with: ctx => ctx.target.constructor.name.replace(/SERVICE/gi, ''),
    })
      .addReplacer({
        regx: /(\[ACTION\])/gi,
        with: ctx => ctx.key,
      })
      .addReplacer({
        regx: /(\[BASE\])/gi,
        with: () => '[HOST]:[PORT]/[PATH]',
      })
      .addReplacer({
        regx: /(\[HOST\])/gi,
        with: () => process.env.API_HOST ?? '',
      })
      .addReplacer({
        regx: /(\[PORT\])/gi,
        with: () => process.env.API_PORT ?? '',
      })
      .addReplacer({
        regx: /(\[PATH\])/gi,
        with: () => process.env.API_BASE ?? '',
      });
  }

  public addReplacer(replacer: Replacer): TemplateReplacer {
    this.replacers.push(replacer);

    return this;
  }

  public replaceString(str: string, ctx: TemplateContext): string {
    return this.replacers.reduce((string, replacer) => {
      return string.replace(replacer.regx, replacer.with(ctx));
    }, str);
  }
})();

export function Template(
  stringsArray: TemplateStringsArray,
  ...keys: string[]
): UrlTemplate {
  keys.forEach(key => {
    if (key.length === 0) {
      throw new Error('Keys in the Template can not be emty.');
    }
  });

  const returns = (
    values: Record<string, string | number>,
    ctx: TemplateContext
  ): string => {
    const strings = stringsArray.map(str =>
      TemplateReplacer.replaceString(str, ctx)
    );

    const result = [strings[0]];
    keys.forEach((key, i) => {
      try {
        const value = values[key];
        result.push(value.toString(), strings[i + 1]);
      } catch (ex) {
        throw new Error(`Missing Param: [${key}]`);
      }
    });
    return result.join('');
  };

  returns.raw = stringsArray.join('');

  return returns;
}
