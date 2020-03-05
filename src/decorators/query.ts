import { Decorator, EvaluationContext } from '../type/Decorator';
import { GetArguments } from '../type';
import { Api } from '../api';

export class MethodQueryDecorator extends Decorator {
  public static KEY = Symbol('api:method:query');

  public static decorate(): ParameterDecorator {
    return (target, key, index): void => {
      const func = Object.getOwnPropertyDescriptor(target, key)?.value;

      if (typeof func === 'function') {
        if (Reflect.hasMetadata(MethodQueryDecorator.KEY, target, key)) {
          throw Error(
            'Using more than one Query. Only on Queryparameter is allowed per Method.'
          );
        }

        Reflect.defineMetadata(
          MethodQueryDecorator.KEY,
          new MethodQueryDecorator(index),
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

  protected constructor(public readonly index: number) {
    super();
  }

  public evaluate<TApi extends Api>(context: EvaluationContext<TApi>): void {
    const argVal = context.args[this.index];
    let query: Record<string, string> = {};

    if (typeof argVal === 'object') {
      Object.keys(argVal).forEach(key => {
        if (typeof argVal[key] === 'object') {
          argVal[key] = JSON.stringify(argVal[key]);
        }
      });

      query = argVal;
    } else if (typeof argVal !== 'undefined') {
      const parameterNames = GetArguments(
        Object.getOwnPropertyDescriptor(context.target, context.propertyKey)
          ?.value
      );

      query = {
        [parameterNames[this.index]]: argVal,
      };
    }

    Object.entries(query).forEach(entry =>
      context.url.searchParams.set(entry[0], entry[1])
    );
  }
}
const Query = MethodQueryDecorator.decorate;

export { Query };
