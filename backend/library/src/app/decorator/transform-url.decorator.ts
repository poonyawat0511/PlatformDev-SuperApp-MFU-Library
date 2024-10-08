import { Transform, TransformFnParams } from 'class-transformer';
import {
  assignObjectValue,
  getObjectValue,
} from 'src/app/common/utils/object.util';
import configuration from '../config/configuration';
import { config } from 'dotenv';

type ParseOptions =
  | {
      type: 'string';
      validate?: boolean;
      array?: boolean;
    }
  | {
      type: 'object';
      validate?: boolean;
      array?: boolean;
      paths: string[] | 'all';
    };

config();
const baseUrl = configuration()['upload']['baseUrl'];

function replaceUrl(value?: string) {
  if (!value) return value;
  if ((value as string).startsWith(baseUrl)) return value;
  return `${baseUrl}/${value}`;
}

export function TransformUrl(
  options: ParseOptions,
  condition?: (params: TransformFnParams) => boolean,
) {
  function throwInvalidType(key: string, type: string) {
    if (!options.validate) return;
    throw new Error(`value type of key '${key}' is not given type '${type}'`);
  }

  return Transform((params: TransformFnParams) => {
    const { value, key } = params;
    if (condition) {
      const valid = condition(params);
      if (!valid) return value;
    }
    if (!value) return value;

    function assignValue(value: any, transform: (value: any) => any) {
      if (options.array) {
        if (Array.isArray(value)) {
          return value.map((obj) => transform(obj));
        }
        throwInvalidType(key, 'array');
        return value;
      } else {
        return transform(value);
      }
    }

    if (options.type === 'object') {
      return assignValue(value, (obj) => {
        if (typeof obj === 'object') {
          const keys =
            options.paths === 'all' ? Object.keys(obj) : options.paths;
          keys.forEach((path) => {
            const target = getObjectValue(obj, path);
            assignObjectValue(obj, path, replaceUrl(target));
          });
          return obj;
        }
        throwInvalidType(key, options.type);
        return value;
      });
    } else if (options.type === 'string') {
      return assignValue(value, (str) => {
        if (typeof str === 'string') {
          return replaceUrl(str);
        }
        throwInvalidType(key, 'string');
        return value;
      });
    }
    return value;
  });
}
