import { App } from 'vue';
import AButton from './components/Button/button';
import AInput from './components/Input.vue';

export { AButton };
export { AInput };

export default {
  install(app: App) {
    app.component(AButton.name, AButton);
    app.component(AInput.name || 'AInput', AInput);
  },
};
