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

const ArgumentMetadataKey = Symbol('api:argumentlist');

export function GetArguments(func: Function): string[] {
  let metadata: string[] | undefined = Reflect.getMetadata(
    ArgumentMetadataKey,
    func
  );

  if (typeof metadata === 'undefined') {
    // First match everything inside the function argument parens.
    const args = func.toString().match(/^.*?\(([^)]*)\)/)?.[1] ?? '';

    // Split the arguments string into an array comma delimited.
    metadata = args
      .split(',')
      // Ensure no inline comments are parsed and trim the whitespace.
      .map(arg => arg.replace(/\/\*.*\*\//, '').trim())
      // Ensure no undefined values are added.
      .filter(arg => arg);

    Reflect.defineMetadata(ArgumentMetadataKey, metadata, func);
  }

  return metadata;
}
