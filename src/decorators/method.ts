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

/**
 * Defines a function to execute a given request
 * @param type The request method that the request should use
 * @param template Template that this request should use. When not provided uses '/[ACTION]'.
 */
const Method = RequestMethodDecorator.decorate;

/**
 * Defines this function to execute a `GET` request
 * @param template Template that this request should use. When not provided uses the name of the decorated Method.
 */
function Get(template?: UrlTemplate): ReturnType<typeof Method> {
  return Method('GET', template);
}

/**
 * Defines this function to execute a `POST` request
 * @param template Template that this request should use. When not provided uses the name of the decorated Method.
 */
function Post(template?: UrlTemplate): ReturnType<typeof Method> {
  return Method('POST', template);
}

/**
 * Defines this function to execute a `PUT` request
 * @param template Template that this request should use. When not provided uses the name of the decorated Method.
 */
function Put(template?: UrlTemplate): ReturnType<typeof Method> {
  return Method('PUT', template);
}

/**
 * Defines this function to execute a `PATCH` request
 * @param template Template that this request should use. When not provided uses the name of the decorated Method.
 */
function Patch(template?: UrlTemplate): ReturnType<typeof Method> {
  return Method('PATCH', template);
}

/**
 * Defines this function to execute a `DELETE` request
 * @param template Template that this request should use. When not provided uses the name of the decorated Method.
 */
function Delete(template?: UrlTemplate): ReturnType<typeof Method> {
  return Method('DELETE', template);
}

export { Method, Get, Post, Put, Patch, Delete };
