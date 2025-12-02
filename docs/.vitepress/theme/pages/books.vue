<template>
  <div class="book-collection">
    <h1>📚 书山拾叶</h1>
    <div class="filter-bar">
      <button
        v-for="category in categories"
        :key="category.value"
        :class="['filter-btn', { active: currentCategory === category.value }]"
        @click="setCategory(category.value)">
        {{ category.label }}
      </button>
    </div>
    <div class="books-grid">
      <div v-for="book in filteredBooks" :key="book.title" class="book-card" :data-category="book.category">
        <flip-card :title="book.title" :author="book.author" :cover="book.cover" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import flipCard from '../components/Flip-card.vue';
// 分类数据
const categories = [
  { label: "全部", value: "all" },
  { label: "文学", value: "literature" },
  { label: "人文社科", value: "social-science" },
  { label: "科普/科技", value: "technology" },
];

// 当前选中的分类
const currentCategory = ref("all");

// 模拟书籍数据
const books = ref([
  {
    title: "明朝那些事儿",
    author: "当年明月",
    cover: "/nanxia-blog/book-covers/ming_chao.jpeg",
    tags: ["人文社科", "通俗历史"],
    note: "以幽默诙谐的笔法讲述明朝历史，让严肃的历史变得生动有趣。",
    read: 90,
    category: "social-science",
  },
  {
    title: "三体",
    author: "刘慈欣",
    cover: "/nanxia-blog/book-covers/san_ti.jpeg",
    tags: ["文学", "科幻经典", "雨果奖"],
    note: "中国科幻的里程碑",
    read: 20,
    category: "literature",
  },
  {
    title: "了不起的盖茨比",
    author: "弗朗西斯·斯科特·基·菲茨杰拉德",
    cover: "/nanxia-blog/book-covers/the_great_gatsby.jpeg",
    tags: ["美国文学", "经典", "爵士时代"],
    note: "20世纪美国文学的经典之作，探讨美国梦与人性",
    read: 100,
    category: "literature",
  },
  {
    title: "文学少女",
    author: "野村美月",
    cover: "/nanxia-blog/book-covers/wen_shao.jpeg",
    tags: ["文学", "轻小说", "校园", "治愈"],
    note: "名著解读×校园青春，温暖治愈的轻小说时光",
    read: 100,
    category: "literature",
  },
  {
    title: "呼啸山庄",
    author: "艾米莉·勃朗特",
    cover: "/nanxia-blog/book-covers/Wuthering-Heights.jpeg",
    tags: ["哥特文学", "经典", "爱情", "复仇"],
    note: "爱与恨的极致交织，荒原上的永恒悲剧", 
    read: 60,
    category: "literature",
  },
  {
    title: "钢铁是怎样炼成的",
    author: "尼古拉·奥斯特洛夫斯基",
    cover: "/nanxia-blog/book-covers/How_the_Steel_Was_Tempered.jpeg",
    tags: ["苏联文学", "成长小说", "励志", "经典"],
    note: "保尔·柯察金的成长史诗，诠释生命的意义与信仰的力量",
    read: 100,
    category: "literature",
  },
  {
    title: "猫武士",
    author: "艾琳·亨特",
    cover: "/nanxia-blog/book-covers/Warriors.jpeg",
    tags: ["动物小说", "奇幻", "冒险", "成长"],
    note: "通过猫族社会的权力斗争与生存法则，探讨忠诚、勇气与自然法则的永恒命题",
    read: 50,
    category: "literature",
  },
]);

// 设置当前分类
const setCategory = (category) => {
  currentCategory.value = category;
};

// 过滤后的书籍列表
const filteredBooks = computed(() => {
  if (currentCategory.value === "all") {
    return books.value.sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  } else {
    return books.value.filter((book) => book.category === currentCategory.value).sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  }
});
</script>

<style scoped>
.book-collection {
  margin: 0 auto;
  padding: 2rem;
}

/* 标题样式 */
h1 {
  font-family: "Playfair Display", "思源宋体", Georgia, "Times New Roman", serif;
  font-weight: bold;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

h1::after {
  content: "「一叶知秋，一书知心」";
  display: block;
  font-size: 0.9rem;
  margin-top: 1.5rem;
  font-family: "Noto Serif SC", serif;
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  justify-content: start;
  gap: 10px;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 3px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn:hover,
.filter-btn.active {
  background: linear-gradient( rgb(255, 231, 222) 88%,
     rgb(255, 211, 195));
  border-color: rgba(255, 127, 80, 0.603);
  box-shadow: 0 3px 15px 2px rgb(255, 211, 195) 40%;
}

/* 书籍卡片网格 */
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

/* 书籍卡片 */
.book-card {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  
}
</style>
