import Theme from "vitepress/theme";
import "./style/var.css";
import Live2d from "./components/Live2d.vue";

export default {
  ...Theme,
  enhanceApp({ app }) {
    app.component("Live2d", Live2d);
  },
};