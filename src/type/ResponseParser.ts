import {
  ClassTransformOptions,
  deserialize,
  deserializeArray,
} from 'class-transformer';
import { TypeOf } from '../';

export class ResponseParser {
  public constructor(private readonly _response: Promise<Response>) {}

  public async asJson<T>({
    type,
    options,
  }: { type?: TypeOf<T>; options?: ClassTransformOptions } = {}): Promise<T> {
    try {
      const response = await this._response.then(r => r.clone().text());

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
      const response = await this._response.then(r => r.clone().text());

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
      return await (await this._response).clone().arrayBuffer();
    } catch (ex) {
      console.warn(ex);
      throw ex;
    }
  }

  public async asBlob(): Promise<Blob> {
    try {
      return (await this._response).blob();
    } catch (ex) {
      console.warn(ex);
      throw ex;
    }
  }

  public async asFormData(): Promise<FormData> {
    try {
      return (await this._response).formData();
    } catch (ex) {
      console.warn(ex);
      throw ex;
    }
  }

  public async asText(): Promise<string> {
    try {
      return (await this._response).text();
    } catch (ex) {
      console.warn(ex);
      throw ex;
    }
  }

  public async asRaw(): Promise<Response> {
    try {
      return (await this._response).clone();
    } catch (ex) {
      console.warn(ex);
      throw ex;
    }
  }
}
