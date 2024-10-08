import { ResponseDto } from '../dto/response.dto';
import { Builder } from '../lib/builder';

export function createResponse<T>(
  statusCode: number,
  message: string,
  data?: T,
): ResponseDto<T> {
  return {
    statusCode,
    message,
    data,
  };
}

export enum ResponseMethod {
  findOne = 'findOne',
  findAll = 'findAll',
  create = 'create',
  update = 'update',
  remove = 'remove',
}

type ResponseParamsMap = {
  [ResponseMethod.findOne]: { id: string };
  [ResponseMethod.update]: { id: string };
  [ResponseMethod.remove]: { id: string };
};

export type ExtractResponseMethod<T extends ResponseMethod> =
  T extends keyof ResponseParamsMap ? ResponseParamsMap[T] : never;

export class MessageBuilder extends Builder {
  build<Method extends ResponseMethod>(
    method: Method,
    options?: ExtractResponseMethod<Method>,
  ) {
    switch (method) {
      case ResponseMethod.findOne:
        return `Get ${this.getName()} by id ${options.id} successfully`;
      case ResponseMethod.findAll:
        return `Get ${this.getName({ purals: true })} successfully`;
      case ResponseMethod.create:
        return `${this.getName({ purals: true, upper: true })} created successfully`;
      case ResponseMethod.update:
        return `Updated ${this.getName()} by id ${options.id} successfully`;
      case ResponseMethod.remove:
        return `Deleted ${this.getName()} by id ${options.id} successfully`;
      default:
        throw new Error('Invalid error method');
    }
  }
}
