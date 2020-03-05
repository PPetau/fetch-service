import { Decorator, EvaluationContext } from '../type/Decorator';
import { TemplateReplacer } from '../type/Template';

export class ServiceDecorator extends Decorator {
  public static KEY = Symbol('api:service');

  public static decorate(host?: string): ClassDecorator {
    return (target): void => {
      if (!host) host = '[BASE]/[SERVICE]';

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

  public evaluate(context: EvaluationContext): void {
    context.url = new URL(
      TemplateReplacer.replaceString(this.host, {
        target: context.target,
        key: context.propertyKey,
      })
    );
  }
}

const Service = ServiceDecorator.decorate;

export { Service };
