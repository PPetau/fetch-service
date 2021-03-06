import { serialize } from 'class-transformer';
import { Decorator, EvaluationContext } from '../type/Decorator';

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

  public evaluate(context: EvaluationContext): void {
    const argVal = context.args[this.index];

    if (typeof argVal === 'object') {
      context.request.headers = {
        'Content-Type': 'application/json',
        ...(context.request.headers ?? {}),
      };

      context.request.body = serialize(argVal);
    } else if (argVal) {
      context.request.headers = {
        'Content-Type': 'text/plain',
        ...(context.request.headers ?? {}),
      };

      context.request.body = JSON.stringify(argVal);
    } else {
      context.request.body = undefined;
    }
  }
}

/**
 * Will be used as the Body of the request
 *
 * When value is an object it will be serialized by 'class-transformer'
 * When value is string it will be used direclty as the body
 *
 * Content-Type will be set accordingly but can be orverwritten
 */
const Body = MethodBodyDecorator.decorate;

export { Body };
