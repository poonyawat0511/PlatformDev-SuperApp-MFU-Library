export function transformFile<T extends object>(
  file: Express.Multer.File | undefined,
  dto: T,
  target: string,
): T {
  // Set dto target to file if exists
  if (file) {
    dto[target] = file?.filename;
    return dto;
  }
  // If dto is not a string return it by default
  if (typeof dto[target] !== 'string') return dto;
  // If data is empty string set it to empty string
  if (!dto[target]) {
    dto[target] = null;
    return dto;
  }
  // Delete dto target if not changes
  delete dto[target];
  return dto;
}
