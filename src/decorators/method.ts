import { Decorator, EvaluationContext } from '../type/Decorator';
import { UrlTemplate, Template } from '../type/Template';
import { MethodParameterDecorator } from './parameter';

type RequestType = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

class RequestMethodDecorator extends Decorator {
  public static KEY = Symbol('api:service');

  public static decorate(
    type: RequestType,
    template?: UrlTemplate
  ): MethodDecorator {
    return (target, key): void => {
      if (!template) template = Template`/[ACTION]`;

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

  public evaluate(context: EvaluationContext): void {
    const parameters = (
      (Reflect.getMetadata(
        MethodParameterDecorator.KEY,
        context.target,
        context.propertyKey
      ) as MethodParameterDecorator[]) ?? []
    ).map(p => p.evaluate(context));

    context.url.pathname += this.template(Object.fromEntries(parameters), {
      target: context.target,
      key: context.propertyKey,
    });

    context.request.method = this.type;
  }
}

const Method = RequestMethodDecorator.decorate;

function Get(template?: UrlTemplate): ReturnType<typeof Method> {
  return Method('GET', template);
}

function Post(template?: UrlTemplate): ReturnType<typeof Method> {
  return Method('POST', template);
}

function Put(template?: UrlTemplate): ReturnType<typeof Method> {
  return Method('PUT', template);
}

function Patch(template?: UrlTemplate): ReturnType<typeof Method> {
  return Method('PATCH', template);
}

function Delete(template?: UrlTemplate): ReturnType<typeof Method> {
  return Method('DELETE', template);
}

export { Method, Get, Post, Put, Patch, Delete };
