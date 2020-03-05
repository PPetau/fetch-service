import { EvaluationContext } from '../type/Decorator';

export class HeadersDecorator {
  public static KEY = Symbol('api:service:headers');

  public static decorate(headers: Record<string, string>) {
    return (target: object, propertyKey?: string): void => {
      if (typeof propertyKey === 'undefined') {
        const other: HeadersDecorator[] =
          Reflect.getMetadata(HeadersDecorator.KEY, target) ?? [];

        Reflect.defineMetadata(
          HeadersDecorator.KEY,
          [new HeadersDecorator(headers), ...other],
          target
        );
      } else {
        const other: HeadersDecorator[] =
          Reflect.getMetadata(HeadersDecorator.KEY, target, propertyKey) ?? [];

        Reflect.defineMetadata(
          HeadersDecorator.KEY,
          [new HeadersDecorator(headers), ...other],
          target,
          propertyKey
        );
      }
    };
  }

  protected constructor(private headers: Record<string, string>) {}

  public evaluate(context: EvaluationContext): void {
    context.request.headers = {
      ...(context.request.headers ?? {}),
      ...this.headers,
    };
  }
}

/**
 * Applies given Headers to the Request
 *
 * @param headers - Object with the Headers
 */
const Header = HeadersDecorator.decorate;

export { Header };
