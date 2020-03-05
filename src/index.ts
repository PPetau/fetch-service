import * as Transform from 'class-transformer';
import { TemplateReplacer } from './type/Template';
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

const defineTemplate = TemplateReplacer.addReplacer;

export { Transform, defineTemplate };
