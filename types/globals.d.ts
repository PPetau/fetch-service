declare const __DEV__: boolean;

declare type Ctor<T extends Function | object> = { new (...args: any[]): T };
