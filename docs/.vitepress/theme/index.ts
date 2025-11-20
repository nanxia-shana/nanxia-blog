import { App } from "vue";
import Theme from "vitepress/theme";
import "./style/var.css";
import Layout from "./Layout.vue";

import Live2d from "./components/Live2d.vue";

import Background from "./components/Background.vue";

import Front from "./pages/front.vue";
import Books from "./pages/books.vue";
import Music from "./pages/music.vue";
import Movies from "./pages/movies.vue";
import Anime from "./pages/anime.vue";
import Games from "./pages/games.vue";
import Novels from "./pages/novels.vue";

export default {
  ...Theme,
  enhanceApp({ app }: { app: App }) {
    app.component("Background", Background);
    app.component("Live2d", Live2d);
    // Pages
    app.component("Front", Front);
    app.component("Books", Books);
    app.component("Music", Music);
    app.component("Movies", Movies);
    app.component("Anime", Anime);
    app.component("Games", Games);
    app.component("Novels", Novels);
  },
  Layout: Layout,
};