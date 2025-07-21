import Theme from "vitepress/theme";
import "./style/var.css";
import Live2d from "./components/Live2d.vue";
import Background from "./components/Background.vue";
import Books from "./pages/books.vue";
import Music from "./pages/books.vue"; 

export default {
  ...Theme,
  enhanceApp({ app }) {
    app.component("Background", Background);
    app.component("Live2d", Live2d);
    // Pages
    app.component("Books", Books); 
    app.component("Music", Music);
  },
};