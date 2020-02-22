import { Decorator, EvaluationContext } from '../type/Decorator';
import { GetArguments } from '../type';
import { Api } from '../api';

export class MethodQueryDecorator extends Decorator {
  public static KEY = Symbol('api:method:param');

  public static decorate(parameterName?: string): ParameterDecorator {
    return (target, key, index): void => {
      const func = Object.getOwnPropertyDescriptor(target, key)?.value;

      if (typeof func === 'function') {
        const otherParamters: MethodQueryDecorator[] =
          Reflect.getMetadata(MethodQueryDecorator.KEY, target, key) ?? [];

        if (!parameterName) parameterName = GetArguments(func)[index];

        Reflect.defineMetadata(
          MethodQueryDecorator.KEY,
          [new MethodQueryDecorator(parameterName, index), ...otherParamters],
          target,
          key
        );
      } else {
        throw Error(
          'Used @Param in invalid context! Use it on a Parameter inside a method.'
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

  public evaluate<TApi extends Api>(
    context: EvaluationContext<TApi>
  ): [string, any] {
    return [this.parameterName, context.args[this.index]];
  }
}

const Query = MethodQueryDecorator.decorate;

export { Query };
