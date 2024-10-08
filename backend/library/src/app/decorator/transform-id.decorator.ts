import { Transform } from 'class-transformer';
import { Types, isObjectIdOrHexString } from 'mongoose';

type TransformObjectFn = (value: any) => any;

function transformer(value: any, transform: TransformObjectFn) {
  if (isObjectIdOrHexString(value)) {
    if (value instanceof Types.ObjectId) return value.toHexString();
    return value;
  }
  return transform(value);
}

export function TransformId(transform: TransformObjectFn) {
  return Transform(({ value }) => {
    if (!value) return value;
    if (Array.isArray(value)) {
      return value.map((child) => transformer(child, transform));
    }
    return transformer(value, transform);
  });
}
