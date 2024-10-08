import { registerDecorator, ValidationOptions } from 'class-validator';
import { Types } from 'mongoose';

export function IsOptionalMongoId(validationOptions?: ValidationOptions) {
  return function (object: Record<any, any>, propertyName: string) {
    registerDecorator({
      name: 'isOptionalMongoId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return true;
          return Types.ObjectId.isValid(value);
        },
      },
    });
  };
}
