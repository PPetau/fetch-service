import { Decorator, EvaluationContext } from '../type/Decorator';
import { Api } from '../api';

export class ServiceDecorator extends Decorator {
  public static KEY = Symbol('api:service');

  public static decorate(host: string): ClassDecorator {
    return (target): void => {
      Reflect.defineMetadata(
        ServiceDecorator.KEY,
        new ServiceDecorator(host),
        target
      );
    };
  }

  protected constructor(private host: string) {
    super();
  }

  public evaluate<TApi extends Api>(context: EvaluationContext<TApi>): void {
    context.url = new URL(this.host);
  }
}

const Service = ServiceDecorator.decorate;

export { Service };
