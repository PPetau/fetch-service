import { Decorator, EvaluationContext } from '../type/Decorator';
import { GetArguments } from '../type';

export class MethodQueryDecorator extends Decorator {
  public static KEY = Symbol('api:method:query');

  public static decorate(name?: string): ParameterDecorator {
    return (target, key, index): void => {
      const func = Object.getOwnPropertyDescriptor(target, key)?.value;

      if (typeof func === 'function') {
        const otherQuerys: MethodQueryDecorator[] =
          Reflect.getMetadata(MethodQueryDecorator.KEY, target, key) ?? [];

        if (!name) name = GetArguments(func)[index];

        Reflect.defineMetadata(
          MethodQueryDecorator.KEY,
          [new MethodQueryDecorator(name, index), ...otherQuerys],
          target,
          key
        );
      } else {
        throw Error(
          'Used @Query in invalid context! Use it on a Parameter inside a method.'
        );
      }
    };
  }

  protected constructor(
    public readonly parameterName: string,
    public readonly index: number
  ) {
    super();
  }

  public evaluate(context: EvaluationContext): void {
    const value = context.args[this.index];

    if (typeof value === 'string') {
      context.url.searchParams.set(this.parameterName, value);
    } else if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(entry => {
        context.url.searchParams.set(entry[0], entry[1] as string);
      });
    }
  }
}

/**
 * Makes this argument a value of the request searchParams
 * If value is of type string it will be used with the given name of the argument
 * When value is of type object all keys will be used as a queryparameter
 *
 * @param name - an optional name that will override the argumentname
 */
const Query = MethodQueryDecorator.decorate;

export { Query };
