import {
  Decorator,
  ClassDecoratorFactory,
  EvaluationContext,
} from 'types/decorator';
import { Api } from '#src/api';

export class ServiceDecorator implements Decorator<ClassDecoratorFactory> {
  KEY = Symbol('api:service');
  public decorate(host: string, port: number): ClassDecorator {
    return (target): void => {
      console.log(target, host, port);
    };
  }
  public evaluate<TApi extends Api>(context: EvaluationContext<TApi>): void {
    console.log(context);
  }
}
