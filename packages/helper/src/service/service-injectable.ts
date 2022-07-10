import { ServiceStorage } from './service-storage';

/**
 * 注入服务
 * @param serviceType 服务类型
 */
export function injectable(serviceType: Function) {
  ServiceStorage.instance.register(serviceType);
}
