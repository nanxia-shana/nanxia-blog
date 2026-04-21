import { App } from "vue";
import Theme from "vitepress/theme";
import "./style/var.css";
import Layout from "./Layout.vue";

import Background from "./components/Background.vue";

import Knowledge from "./pages/knowledge.vue";
import Front from "./pages/front.vue";
import Book from "./pages/book.vue";
import Music from "./pages/music.vue";
import Movie from "./pages/movie.vue";
import Anime from "./pages/anime.vue";
import Game from "./pages/game.vue";
import Novel from "./pages/novel.vue";
import Other from "./pages/other.vue";

export default {
  ...Theme,
  enhanceApp({ app }: { app: App }) {
    app.component("Background", Background);
    // Pages
    app.component("Knowledge", Knowledge);
    app.component("Front", Front);
    app.component("Book", Book);
    app.component("Music", Music);
    app.component("Movie", Movie);
    app.component("Anime", Anime);
    app.component("Game", Game);
    app.component("Novel", Novel);
    app.component("Other", Other);
  },
  Layout: Layout,
};