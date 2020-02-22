import { Decorator, EvaluationContext } from '../type/Decorator';
import { Api } from '../api';
import { UrlTemplate } from '../type/Template';
import { MethodParameterDecorator } from './parameter';

type RequestType = 'GET';

class RequestMethodDecorator extends Decorator {
  public static KEY = Symbol('api:service');

  public static decorate(
    type: RequestType,
    template: UrlTemplate
  ): MethodDecorator {
    return (target, key): void => {
      Reflect.defineMetadata(
        RequestMethodDecorator.KEY,
        new RequestMethodDecorator(type, template),
        target,
        key
      );
    };
  }

  protected constructor(
    private type: RequestType,
    private template: UrlTemplate
  ) {
    super();
  }

  public evaluate<TApi extends Api>(context: EvaluationContext<TApi>): void {
    const parameters = (
      (Reflect.getMetadata(
        MethodParameterDecorator.KEY,
        context.target,
        context.propertyKey
      ) as MethodParameterDecorator[]) ?? []
    ).map(p => p.evaluate(context));

    context.url.pathname = this.template(Object.fromEntries(parameters));

    context.request.method = this.type;
  }
}

const Method = RequestMethodDecorator.decorate;

export { Method };
