import { App, defineAsyncComponent } from "vue";
import Theme from "vitepress/theme";
import "./style/var.css";
import Layout from "./Layout.vue";

import Background from "./components/Background.vue";
import PoemPrecomputeDemo from "./components/PoemPrecomputeDemo.vue";
import Poem from "./components/Poem.vue";

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
    app.component("PoemPrecomputeDemo", PoemPrecomputeDemo);
    app.component("Poem", Poem);

    // 仅在对应路由用到的页面组件 → 异步拆包,数据随组件按需加载
    app.component("Knowledge", defineAsyncComponent(() => import("./pages/knowledge.vue")));
    app.component("Frontend", defineAsyncComponent(() => import("./pages/frontend.vue")));
    app.component("Backend", defineAsyncComponent(() => import("./pages/backend.vue")));
    app.component("Misc", defineAsyncComponent(() => import("./pages/misc.vue")));

    app.component("SpiritualFood", defineAsyncComponent(() => import("./pages/spiritual-food.vue")));
    app.component("Book", defineAsyncComponent(() => import("./pages/book.vue")));
    app.component("Music", defineAsyncComponent(() => import("./pages/music.vue")));
    app.component("Movie", defineAsyncComponent(() => import("./pages/movie.vue")));
    app.component("Anime", defineAsyncComponent(() => import("./pages/anime.vue")));
    app.component("Game", defineAsyncComponent(() => import("./pages/game.vue")));
    app.component("Recipe", defineAsyncComponent(() => import("./pages/recipe.vue")));
    app.component("Novel", defineAsyncComponent(() => import("./pages/novel.vue")));
    app.component("Note", defineAsyncComponent(() => import("./pages/note.vue")));

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