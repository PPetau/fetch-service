import { EvaluationContext } from '../type/Decorator';
import { Api } from '../api';

export class HeadersDecorator {
  public static KEY = Symbol('api:service:headers');

  public static decorate(
    headers: Record<string, string>
  ): ClassDecorator | PropertyDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (target: Object, propertyKey?: string): void => {
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

  public evaluate<TApi extends Api>(context: EvaluationContext<TApi>): void {
    if (typeof context.request.headers === 'undefined')
      context.request.headers = this.headers;
    else {
      context.request.headers = {
        ...context.request.headers,
        ...this.headers,
      };
    }
  }
}

const Header = HeadersDecorator.decorate;

export { Header };
