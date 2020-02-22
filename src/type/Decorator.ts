import { Api } from '../api';

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
  public url!: URL;

  public readonly target: TApi;

  public readonly args: any[];

  public readonly propertyKey: string | symbol;

  public constructor(target: TApi, propertyKey: string | symbol, args: any[]) {
    this.request = {};
    this.target = target;
    this.args = args;
    this.propertyKey = propertyKey;
  }

  public buildRequest(): Request {
    return new Request(this.url.href, this.request);
  }
}

export abstract class Decorator {
  public static KEY: string | symbol;

  public static decorate: DecoratorType = () => {
    throw new Error('Decorate is not implemented!');
  };

  public abstract evaluate<TApi extends Api>(
    context: EvaluationContext<TApi>
  ): void;
}
