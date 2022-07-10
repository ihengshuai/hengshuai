export { injectable as Injectable } from './service-injectable';
export { ServiceStorage } from './service-storage';

// 注入服务
// function Service(target: any, prop: string) {
//   const type = Reflect.getMetadata('design:type', target, prop);
//   target[prop] = ServiceStorage.instance.resolve(type);
// }

// 可注入服务
// @Injectable
// class UserService {
//   async login(): Promise<string> {
//     return await new Promise((resolve) => {
//       setTimeout(() => {
//         resolve('login success');
//       }, 1000);
//     });
//   }
// }

// class Page {
//   @Service // 注入服务
//   private service: UserService;

//   public async toLogin(): Promise<string> {
//     const rs = await this.service.login();
//     console.log(rs);
//     return rs;
//   }
// }
// const page = new Page();
// page.toLogin();
