import { getMetadata } from './type';
import EnumEntry from './enum-entry';

export class EnumUtils {
  private static readonly _entryCache = new Map<any, Array<EnumEntry<any>>>();

  public static getEntry<T>(value: number, type: any): EnumEntry<T> {
    if (!type) {
      throw new Error();
    }

    const entries = this.getEntries<T>(type).filter((e) => e.value === value);

    return entries.length === 1 ? entries[0] : null;
  }

  public static getEntries<T>(type: any): Array<EnumEntry<T>> {
    if (!type) {
      throw new Error();
    }

    if (this._entryCache.has(type)) {
      return this._entryCache.get(type);
    }

    const metadata = getMetadata(type) || {};
    const entries: Array<EnumEntry<T>> = [];
    const fields = this.getFields(type);

    for (const [name, value] of fields) {
      const meta = metadata[name];
      const alias: string = meta ? meta.alias : '';
      const description: string = meta ? meta.description : '';
      const field: string = meta ? meta.field : '';
      const _meta: T = meta ? meta.meta : null;
      entries.push(
        new EnumEntry<T>(name, value, alias, description, field, _meta),
      );
    }

    if (entries.length > 0) {
      this._entryCache.set(type, entries);
    }

    return entries;
  }

  public static getFields(type: any): Array<[string, number]> {
    if (!type) {
      throw new Error();
    }
    const fields = Object.keys(type)
      .map((key) => [key, type[key]])
      .filter(([name]) => !/^\d+$/.test(name));

    return fields as Array<[string, number]>;
  }
}
