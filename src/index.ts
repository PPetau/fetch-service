import * as Transform from 'class-transformer';
export {
  Service,
  Method,
  Param,
  Query,
  Body,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Header,
} from './decorators';
export { Template } from './type/Template';
export { Api } from './api';
export type TypeOf<T> = { new (...args: unknown[]): T };

export { Transform };
