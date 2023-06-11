/**
 * 服务存储
 */
export class ServiceStorage {
  private static _instance: ServiceStorage;

  private _storage: Map<Function, any> | null;

  public static get instance(): ServiceStorage {
    if (!this._instance) {
      this._instance = new ServiceStorage();
    }
    return this._instance;
  }

  protected constructor() {
    this._storage = new Map();
  }

  public register(serviceType: Function, service?: any): void {
    if (!this._storage?.has(serviceType)) {
      const { serviceType: st, service: s } = new ServiceEntry(
        serviceType,
        service,
      );
      this._storage?.set(st, s);
    }
  }
  public unregister(serviceType: Function): void {
    this._storage?.delete(serviceType);
  }

  public resolve<T>(serviceType: Function): T {
    return this._storage?.get(serviceType);
  }

  public reset(): void {
    this._storage?.clear();
  }
  public destroy(): void {
    this.reset();
    this._storage = null;
  }
  public has(serviceType: Function): boolean {
    return !!this._storage && this._storage?.has(serviceType);
  }
}

/**
 * 服务项
 */
class ServiceEntry {
  private _service: any = null;
  private _serviceType: Function;

  public get serviceType(): Function {
    return this._serviceType;
  }

  public get service(): any {
    if (!this._service) {
      this._service = this.createService();
    }
    return this._service;
  }

  public constructor(serviceType: Function, service: any) {
    if (service && service?.constructor !== serviceType) {
      throw new Error('Service instance does not match service type.');
    }
    this._serviceType = serviceType;
    this._service = service || null;
  }

  protected createService(): any {
    const ctor = this._serviceType as FunctionConstructor;
    return ctor ? new ctor() : null;
  }
}
