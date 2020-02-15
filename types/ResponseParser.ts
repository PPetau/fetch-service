import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { Type } from 'types';

export class ResponseParser {
  public constructor(private readonly _response: Promise<Response>) {}

  public async asJson<T>({
    type,
    options,
  }: { type?: Type<T>; options?: ClassTransformOptions } = {}): Promise<T> {
    try {
      const response: T = await this._response.then(r => r.clone().json());

      if (type) {
        return plainToClass(type, response, options);
      } else {
        return response;
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
