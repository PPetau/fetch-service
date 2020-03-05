import { Decorator, EvaluationContext } from '../type/Decorator';
import { GetArguments } from '../type';
import { serialize } from 'class-transformer';

export class MethodParameterDecorator extends Decorator {
  public static KEY = Symbol('api:method:param');

  public static decorate(parameterName?: string): ParameterDecorator {
    return (target, key, index): void => {
      const func = Object.getOwnPropertyDescriptor(target, key)?.value;

      if (typeof func === 'function') {
        const otherParamters: MethodParameterDecorator[] =
          Reflect.getMetadata(MethodParameterDecorator.KEY, target, key) ?? [];

        if (!parameterName) parameterName = GetArguments(func)[index];

        Reflect.defineMetadata(
          MethodParameterDecorator.KEY,
          [
            new MethodParameterDecorator(parameterName, index),
            ...otherParamters,
          ],
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

  public evaluate(context: EvaluationContext): [string, string] {
    const val = context.args[this.index];

    if (typeof val === 'string') return [this.parameterName, val];
    else if (typeof val === 'object' && val !== null) {
      return [this.parameterName, serialize(val)];
    } else {
      return [this.parameterName, ''];
    }
  }
}

const Param = MethodParameterDecorator.decorate;

export { Param };
