import { Api } from '../api';

export type ClassDecoratorFactory = (...args: never[]) => ClassDecorator;
export type PropertyDecoratorFactory = (...args: never[]) => PropertyDecorator;
export type MethodDecoratorFactory = (...args: never[]) => MethodDecorator;
export type ParameterDecoratorFactory = (
  ...args: never[]
) => ParameterDecorator;

type DecoratorType =
  | ClassDecoratorFactory
  | PropertyDecoratorFactory
  | MethodDecoratorFactory
  | ParameterDecoratorFactory
  | ClassDecorator
  | PropertyDecorator
  | MethodDecorator
  | ParameterDecorator;

export class EvaluationContext {
  public request: RequestInit;
  public url!: URL;

  public readonly target: Api;

  public readonly args: unknown[];

  public readonly propertyKey: string;

  public constructor(target: TApi, propertyKey: string, args: unknown[]) {
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

  public abstract evaluate(context: EvaluationContext): void;
}
