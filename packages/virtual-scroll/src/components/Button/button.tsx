import { defineComponent, PropType } from 'vue';
import './button.scss';

type background = 'black' | 'white';

export default defineComponent({
  name: 'AButton',
  props: {
    background: {
      type: String as PropType<background>,
      default: 'white',
    },
  },
  setup() {
    return () => <button>button...</button>;
  },
});
