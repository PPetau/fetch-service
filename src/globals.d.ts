declare const __DEV__: boolean;

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    API_HOST?: string;
    API_PORT?: string;
    API_BASE?: string;
  }
}
