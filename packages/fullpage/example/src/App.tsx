import { defineComponent, onMounted } from "vue";
import "./app.css"
import {FullPage} from "@hengshuai/fullpage"
import "@hengshuai/fullpage/dist/index.css"

export default defineComponent({
  name: "App",
  setup() {

    const initFullPage = () => {
      new FullPage({
        container: "#scoll-root",
        slideItem: ".slide-item",
        idx: 0,
        onSlide(idx) {
            console.log(this, idx)
        },
      });
    }
    onMounted(initFullPage);
    return () => <div class={"fullpage-container"} id="scoll-root">
      <div class={"slide-item"}>
        1
      </div>
      <div class={"slide-item"}>
        2
      </div>
      <div class={"slide-item"}>
        3
      </div>
      <div class={"slide-item"}>
        4
      </div>
    </div>
  }
})
