import { Decorator, EvaluationContext } from '../type/Decorator';

export interface ApiMiddleware {
  before?: (ctx: EvaluationContext) => Promise<void> | void;
  after?: (response: Response) => Promise<void> | void;
}

export class MiddlewareDecorator extends Decorator {
  public static KEY = Symbol('api:service');

  public static decorate(...middlewares: ApiMiddleware[]) {
    return (target: object, propertyKey?: string): void => {
      const decorators = middlewares.map(
        middleware => new MiddlewareDecorator(middleware)
      );

      if (typeof propertyKey === 'undefined') {
        const other: MiddlewareDecorator[] =
          Reflect.getMetadata(MiddlewareDecorator.KEY, target) ?? [];

        Reflect.defineMetadata(
          MiddlewareDecorator.KEY,
          [...decorators, ...other],
          target
        );
      } else {
        const other: MiddlewareDecorator[] =
          Reflect.getMetadata(MiddlewareDecorator.KEY, target, propertyKey) ??
          [];

        Reflect.defineMetadata(
          MiddlewareDecorator.KEY,
          [...decorators, ...other],
          target,
          propertyKey
        );
      }
    };
  }

  protected constructor(private middleware: ApiMiddleware) {
    super();
  }

  public evaluate(context: EvaluationContext): void {
    context.middlewares.push(this.middleware);
  }
}

/**
 * Tells the executor to execute all middlewares that are provided
 * @param middlewares - The Middlewares that should be used for this method
 */
const Middleware = MiddlewareDecorator.decorate;

export { Middleware };
