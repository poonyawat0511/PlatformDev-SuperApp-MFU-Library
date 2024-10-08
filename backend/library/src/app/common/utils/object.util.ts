class PathNotFoundError extends Error {
  constructor(path: string) {
    super(`Path not found: ${path}`);
    this.name = 'PathNotFoundError';
  }
}

export function getObjectValue(
  obj: Record<string, any>,
  path: string,
  throwError: boolean = false,
): any {
  const parts = path.split('.');
  let current = obj;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      if (throwError) {
        throw new PathNotFoundError(path);
      }
      return undefined;
    }
  }

  return current;
}

export function assignObjectValue(
  obj: Record<string, any>,
  path: string,
  value: any,
  throwError: boolean = false,
): Record<string, any> {
  const parts = path.split('.');
  let current = obj;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (i === parts.length - 1) {
      // Last part of the path, assign the value
      current[part] = value;
    } else {
      // Check if current part exists in current object
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        if (throwError) {
          throw new PathNotFoundError(path);
        }
        return;
      }
    }
  }
  return current;
}

export function flattenObject(obj: any, parentKey = ''): Record<string, any> {
  return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
    const value = obj[key];
    const nestedKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(acc, flattenObject(value, nestedKey));
    } else {
      acc[nestedKey] = value;
    }

    return acc;
  }, {});
}
