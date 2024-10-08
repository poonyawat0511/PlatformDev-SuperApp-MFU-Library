import { Transform } from 'class-transformer';

const TransformBoolean = Transform(({ value }) => {
  if (value === 'true' || value === true) {
    return true;
  } else if (value === 'false' || value === false) {
    return false;
  } else {
    return value;
  }
});

const TransformNumber = Transform(({ value }) => {
  const number = parseInt(value);
  return isNaN(number) ? value : number;
});

export function TransformType(type: BooleanConstructor | NumberConstructor) {
  switch (type) {
    case Boolean:
      return TransformBoolean;
    case Number:
      return TransformNumber;
  }
}
