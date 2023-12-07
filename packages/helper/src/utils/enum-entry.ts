export default class EnumEntry<T = any> {
  public readonly name: string;
  public readonly value: number | string;
  public readonly alias: string;
  public readonly description: string;
  public readonly field: string;
  public readonly meta: T;

  public constructor(
    name: string,
    value: number | string,
    alias?: string,
    description?: string,
    field?: string,
    meta?: T,
  ) {
    this.name = name;
    this.value = value;
    this.alias = alias || '';
    this.description = description || '';
    this.field = field || '';
    this.meta = meta || null;
  }
}
