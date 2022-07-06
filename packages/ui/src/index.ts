import type { App, Plugin } from 'vue';
import * as components from './component';
export * from './component';

const install = function (app: App) {
  Object.keys(components).forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const component = components[key];
    if (component.install) {
      app.use(component);
    }
  });
  return app;
};

export default {
  install,
};
