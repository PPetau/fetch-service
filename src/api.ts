import { ResponseParser } from './type/ResponseParser';
import { EvaluationContext, Decorator } from './type/Decorator';
import { MethodParameterDecorator } from './decorators/parameter';

const unwantedKeys = [
  'design:type',
  'design:paramtypes',
  'design:returntype',
  MethodParameterDecorator.KEY,
];

const ApiProxy: ProxyHandler<Api> = {
  get(target, propertyKey: string | symbol, receiver) {
    const classMetadataKeys = Reflect.getMetadataKeys(
      target.constructor
    ).filter(k => !unwantedKeys.includes(k));
    const propertyMetadataKeys = Reflect.getMetadataKeys(
      target,
      propertyKey
    ).filter(k => !unwantedKeys.includes(k));

    // When accessed property has no metadata
    if (propertyMetadataKeys.length === 0)
      return Reflect.get(target, propertyKey, receiver);

    return function(this: typeof target, ...args: never[]): Function {
      const context = new EvaluationContext(
        target,
        propertyKey.toString(),
        args
      );

      classMetadataKeys
        .map<Decorator>(k => Reflect.getMetadata(k, target.constructor))
        .forEach(d => d.evaluate(context));

      propertyMetadataKeys
        .map<Decorator>(k => Reflect.getMetadata(k, target, propertyKey))
        .forEach(d => d.evaluate(context));

      console.log(context);

      this.GetResponse = (): ResponseParser =>
        new ResponseParser(fetch(context.buildRequest()));

      return (Reflect.get(target, propertyKey, receiver) as Function).apply(
        this,
        args
      );
    }.bind(target);
  },
};

export class Api {
  protected GetResponse: () => ResponseParser = () => {
    throw new Error(
      'Calling GetResponse outside of its context. Context is provided when inside a Method that is assigned to a Api-Request.'
    );
  };

  public constructor() {
    return new Proxy(this, ApiProxy);
  }
}
