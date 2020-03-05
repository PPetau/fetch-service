import { Decorator, EvaluationContext } from '../type/Decorator';

export interface ApiMiddleware {
  before?: (ctx: EvaluationContext) => Promise<void> | void;
  after?: (response: Response) => Promise<void> | void;
}

export class MiddlewareDecorator extends Decorator {
  public static KEY = Symbol('api:service');

  public static decorate(middleware: ApiMiddleware): ClassDecorator {
    return (target): void => {
      Reflect.defineMetadata(
        MiddlewareDecorator.KEY,
        new MiddlewareDecorator(middleware),
        target
      );
    };
  }

  protected constructor(private middleware: ApiMiddleware) {
    super();
  }

  public evaluate(context: EvaluationContext): void {
    context.middlewares.push(this.middleware);
  }
}

const Middleware = MiddlewareDecorator.decorate;

export { Middleware };
