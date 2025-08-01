import Theme from "vitepress/theme";
import "./style/var.css";
import Layout from "./Layout.vue";

import Live2d from "./components/Live2d.vue";

import Background from "./components/Background.vue";
import MusicPlayer from "./components/MusicPlayer.vue";

import Books from "./pages/books.vue";
import Music from "./pages/music.vue"; 

export default {
  ...Theme,
  enhanceApp({ app }) {
    app.component("Background", Background);
    app.component("Live2d", Live2d);
    app.component("MusicPlayer", MusicPlayer);
    // Pages
    app.component("Books", Books);
    app.component("Music", Music);
  },
  Layout: Layout,
};