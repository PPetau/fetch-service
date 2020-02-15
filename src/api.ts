import { ResponseParser } from '#types/ResponseParser';
import { EvaluationContext } from '#types/decorator';

const unwantedKeys = ['design:types', 'design:paramtypes', 'design:returntype'];

const ApiProxy: ProxyHandler<Api> = {
  get(target, propertyKey: string | symbol, receiver) {
    const classMetadataKeys = Reflect.getMetadataKeys(target).filter(
      k => !unwantedKeys.includes(k)
    );
    const propertyMetadataKeys = Reflect.getMetadataKeys(
      target,
      propertyKey
    ).filter(k => !unwantedKeys.includes(k));

    // When accessed property has no metadata
    if (propertyMetadataKeys.length === 0)
      return Reflect.get(target, propertyKey, receiver);

    return function(this: typeof target, ...args: any[]): Function {
      const context = new EvaluationContext(target, propertyKey);

      classMetadataKeys.map(k => Reflect.getMetadata(k, target));
      propertyMetadataKeys.map(k =>
        Reflect.getMetadata(k, target, propertyKey)
      );

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
