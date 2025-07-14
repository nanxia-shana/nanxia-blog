import Theme from "vitepress/theme";
import "./style/var.css";
import Live2d from "./components/Live2d.vue";
import Background from "./components/Background.vue";

export default {
  ...Theme,
  enhanceApp({ app }) {
    app.component("Background", Background);
    app.component("Live2d", Live2d);
  },
};