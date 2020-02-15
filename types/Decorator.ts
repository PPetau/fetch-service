import { Api } from '#src/api';

export type ClassDecoratorFactory = (...args: any[]) => ClassDecorator;
export type PropertyDecoratorFactory = (...args: any[]) => PropertyDecorator;
export type MethodDecoratorFactory = (...args: any[]) => MethodDecorator;
export type ParameterDecoratorFactory = (...args: any[]) => ParameterDecorator;

type DecoratorType =
  | ClassDecoratorFactory
  | PropertyDecoratorFactory
  | MethodDecoratorFactory
  | ParameterDecoratorFactory
  | ClassDecorator
  | PropertyDecorator
  | MethodDecorator
  | ParameterDecorator;

export class EvaluationContext<TApi extends Api> {
  public request: RequestInit;
  public url: URL;

  public readonly target: TApi;

  public readonly propertyKey?: string | symbol;

  public constructor(target: TApi, propertyKey?: string | symbol) {
    this.url = new URL('');
    this.request = {};
    this.target = target;
    this.propertyKey = propertyKey;
  }

  public buildRequest(): Request {
    return new Request(this.url.href, this.request);
  }
}

export interface Decorator<T extends DecoratorType> {
  KEY: string | symbol;
  decorate: T;

  evaluate<TApi extends Api>(context: EvaluationContext<TApi>): void;
}
