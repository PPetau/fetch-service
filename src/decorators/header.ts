import { EvaluationContext } from '../type/Decorator';

export class HeadersDecorator {
  public static KEY = Symbol('api:service:headers');

  public static decorate(
    headers: Record<string, string>
  ): ClassDecorator | PropertyDecorator {
    return (target: object, propertyKey?: string): void => {
      if (typeof propertyKey === 'undefined')
        Reflect.defineMetadata(
          HeadersDecorator.KEY,
          new HeadersDecorator(headers),
          target
        );
      else
        Reflect.defineMetadata(
          HeadersDecorator.KEY,
          new HeadersDecorator(headers),
          target,
          propertyKey
        );
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

const Header = HeadersDecorator.decorate;

export { Header };
