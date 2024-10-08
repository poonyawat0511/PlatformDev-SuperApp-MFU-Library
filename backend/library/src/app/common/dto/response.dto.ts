export class ResponseDto<T> {
  statusCode: number;
  message: string;
  data?: T;
}
