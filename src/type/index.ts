export {
  Decorator,
  ClassDecoratorFactory,
  EvaluationContext,
  MethodDecoratorFactory,
  ParameterDecoratorFactory,
  PropertyDecoratorFactory,
} from './Decorator';

export { ResponseParser } from './ResponseParser';

export { Template, UrlTemplate } from './Template';

/**
 * Extracts a list of argumentnames from thie given function
 *
 * @param func Function from that the arguments should be extracted from
 */
export function GetArguments(func: Function): string[] {
  // First match everything inside the function argument parens.
  const args = func.toString().match(/^.*?\(([^)]*)\)/)?.[1] ?? '';

  // Split the arguments string into an array comma delimited.
  return (
    args
      .split(',')
      // Ensure no inline comments are parsed and trim the whitespace.
      .map(arg => arg.replace(/\/\*.*\*\//, '').trim())
      // Ensure no undefined values are added.
      .filter(arg => arg)
  );
}
