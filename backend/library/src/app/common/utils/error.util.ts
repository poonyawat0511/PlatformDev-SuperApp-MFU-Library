import { Builder } from '../lib/builder';

export enum ErrorMethod {
  duplicated = 'duplicated',
  notFound = 'notFound',
}

export enum RequestAction {
  create = 'creating',
  update = 'updating',
}

type ErrorParamsMap = {
  [ErrorMethod.duplicated]: { action: RequestAction };
  [ErrorMethod.notFound]: { id: string };
};

export type ExtractErrorMethod<T extends ErrorMethod> =
  T extends keyof ErrorParamsMap ? ErrorParamsMap[T] : never;

export class ErrorBuilder extends Builder {
  build<Method extends ErrorMethod>(
    method: Method,
    options?: ExtractErrorMethod<Method>,
  ) {
    switch (method) {
      case ErrorMethod.duplicated:
        return `Data is duplicated while ${(options as ExtractErrorMethod<ErrorMethod.duplicated>).action} ${this.getName()}`;
      case ErrorMethod.notFound:
        return `Cannot found ${this.getName()} id ${(options as ExtractErrorMethod<ErrorMethod.notFound>).id}`;
      default:
        throw new Error('Invalid error method');
    }
  }
}
