import { serialize } from 'class-transformer';
import { Decorator, EvaluationContext } from '../type/Decorator';
import { Api } from '../api';

export class MethodBodyDecorator extends Decorator {
  public static KEY = Symbol('api:method:query');

  public static decorate(): ParameterDecorator {
    return (target, key, index): void => {
      const func = Object.getOwnPropertyDescriptor(target, key)?.value;

      if (typeof func === 'function') {
        if (Reflect.hasMetadata(MethodBodyDecorator.KEY, target, key)) {
          throw Error(
            'Using more than one Query. Only on Queryparameter is allowed per Method.'
          );
        }

        Reflect.defineMetadata(
          MethodBodyDecorator.KEY,
          new MethodBodyDecorator(index),
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
    let bodyVal: string | null = null;

    if (typeof argVal === 'object') {
      if (typeof context.request.headers === 'object') {
        context.request.headers = {
          ...context.request.headers,
          'Content-Type': 'application/json',
        };
      } else {
        context.request.headers = {
          'Content-Type': 'application/json',
        };
      }
      bodyVal = serialize(argVal);
    } else {
      bodyVal = argVal;
    }

    context.request.body = bodyVal;
  }
}
const Body = MethodBodyDecorator.decorate;

export { Body };
