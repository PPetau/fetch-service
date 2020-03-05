import {
  ClassTransformOptions,
  deserialize,
  deserializeArray,
} from 'class-transformer';
import { TypeOf } from '../';
import { EvaluationContext } from './Decorator';

export class ResponseParser {
  public constructor(private readonly _context: EvaluationContext) {}

  public async ExecuteRequest(): Promise<Response> {
    for (const middleware of this._context.middlewares) {
      await middleware.before?.(this._context);
    }

    const response = await fetch(this._context.buildRequest());

    for (const middleware of this._context.middlewares) {
      await middleware.after?.(response);
    }

    return response;
  }

  public async asJson<T>({
    type,
    options,
  }: { type?: TypeOf<T>; options?: ClassTransformOptions } = {}): Promise<T> {
    try {
      const response = await this.ExecuteRequest().then(r => r.clone().text());

      if (type) {
        return deserialize(type, response, options);
      } else {
        return JSON.parse(response);
      }
    } catch (ex) {
      console.warn(ex);
      throw ex;
    }
  }

  public async asJsonArray<T>({
    type,
    options,
  }: { type?: TypeOf<T>; options?: ClassTransformOptions } = {}): Promise<T[]> {
    try {
      const response = await this.ExecuteRequest().then(r => r.clone().text());

      if (type) {
        return deserializeArray(type, response, options);
      } else {
        return JSON.parse(response);
      }
    } catch (ex) {
      console.warn(ex);
      throw ex;
    }
  }

  public async asArrayBuffer(): Promise<ArrayBuffer> {
    try {
      return await (await this.ExecuteRequest()).clone().arrayBuffer();
    } catch (ex) {
      console.warn(ex);
      throw ex;
    }
  }

  public async asBlob(): Promise<Blob> {
    try {
      return (await this.ExecuteRequest()).blob();
    } catch (ex) {
      console.warn(ex);
      throw ex;
    }
  }

  public async asFormData(): Promise<FormData> {
    try {
      return (await this.ExecuteRequest()).formData();
    } catch (ex) {
      console.warn(ex);
      throw ex;
    }
  }

  public async asText(): Promise<string> {
    try {
      return (await this.ExecuteRequest()).text();
    } catch (ex) {
      console.warn(ex);
      throw ex;
    }
  }

  public async asRaw(): Promise<Response> {
    try {
      return (await this.ExecuteRequest()).clone();
    } catch (ex) {
      console.warn(ex);
      throw ex;
    }
  }
}
