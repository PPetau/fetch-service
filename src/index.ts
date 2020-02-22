export { Service, Method, Param } from './decorators';
export { Template } from './type/Template';
export { Api } from './api';
export type TypeOf<T> = { new (...args: any[]): T };
