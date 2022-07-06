import { defineComponent } from 'vue';

const Button = defineComponent({
  name: 'HButton',
  props: {},
  setup() {
    return () => (
      <button>
        <slot />
      </button>
    );
  },
});

export default Button;
