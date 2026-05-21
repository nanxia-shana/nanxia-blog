import { App } from "vue";
import Theme from "vitepress/theme";
import "./style/var.css";
import Layout from "./Layout.vue";

import Background from "./components/Background.vue";

import Knowledge from "./pages/knowledge.vue";
import Frontend from "./pages/frontend.vue";
import Backend from "./pages/backend.vue";
import Misc from "./pages/misc.vue";

import spiritualFood from "./pages/spiritual-food.vue";
import Book from "./pages/book.vue";
import Music from "./pages/music.vue";
import Movie from "./pages/movie.vue";
import Anime from "./pages/anime.vue";
import Game from "./pages/game.vue";
import Novel from "./pages/novel.vue";
import Note from "./pages/note.vue";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default {
  ...Theme,
  enhanceApp({ app, router }: { app: App; router: any }) {
    app.component("Background", Background);
    // Pages
    app.component("Knowledge", Knowledge);
    app.component("Frontend", Frontend);
    app.component("Backend", Backend);
    app.component("Misc", Misc);

    app.component("SpiritualFood", spiritualFood);
    app.component("Book", Book);
    app.component("Music", Music);
    app.component("Movie", Movie);
    app.component("Anime", Anime);
    app.component("Game", Game);
    app.component("Novel", Novel);
    app.component("Note", Note);

    // Google Analytics - track page views on route change
    if (typeof window !== "undefined") {
      router.onAfterRouteChanged = (to: string) => {
        if (window.gtag) {
          window.gtag("config", "G-29SDHZ3XTR", {
            page_path: to,
          });
        }
      };
    }
  },
  Layout: Layout,
};