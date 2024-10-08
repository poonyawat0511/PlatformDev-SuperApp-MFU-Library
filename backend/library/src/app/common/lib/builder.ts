export abstract class Builder {
  constructor(
    private model: string,
    private purals?: string,
  ) {
    if (this.model.length === 0) {
      throw new Error('Error model is empty');
    }
  }

  protected getName(
    { purals, upper }: { purals?: boolean; upper?: boolean } = {
      purals: false,
      upper: false,
    },
  ): string {
    const name = purals
      ? this.purals
        ? this.purals
        : this.model + 's'
      : this.model;
    return upper ? name.charAt(0) + name.slice(1).toLowerCase() : name;
  }

  abstract build(method: any, options: any): string;
}
