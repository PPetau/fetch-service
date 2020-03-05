import { Decorator, EvaluationContext } from '../type/Decorator';
import { GetArguments } from '../type';
import { Api } from '../api';

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

  public evaluate<TApi extends Api>(context: EvaluationContext<TApi>): void {
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
const Query = MethodQueryDecorator.decorate;

export { Query };
