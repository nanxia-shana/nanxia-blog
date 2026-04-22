---
layout: doc

lastUpdated: false

---

# Git 版本控制高级技巧

Git 是现代软件开发中不可或缺的版本控制工具。本文将深入讲解 Git 的高级用法，帮助你更高效地管理代码历史、协作开发和解决复杂问题。

## 1. Git 基础回顾

### 1.1 Git 三区模型

```
工作区（Working Directory）
    ↓ git add
暂存区（Staging Area / Index）
    ↓ git commit
本地仓库（Local Repository）
    ↓ git push
远程仓库（Remote Repository）
```

### 1.2 常用命令速查

```bash
# 查看状态
git status
git diff              # 工作区 vs 暂存区
git diff --cached     # 暂存区 vs 本地仓库
git diff HEAD         # 工作区 vs 本地仓库

# 查看历史
git log --oneline --graph --all
git log -p --stat     # 显示变更详情
git blame <file>      # 查看每行的修改者
```

## 2. 分支管理高级

### 2.1 Git Flow 工作流

```
master/main  ── 生产环境代码，随时可发布
    ↑
develop  ───── 开发分支，集成最新功能
    ↑
feature/*  ─── 功能分支，从 develop 创建，完成后合并回 develop
release/*  ─── 发布分支，从 develop 创建，准备发布
hotfix/*  ──── 紧急修复，从 master 创建，修复后合并回 master 和 develop
```

```bash
# 功能分支开发流程
git checkout develop
git checkout -b feature/user-auth
# ... 开发 ...
git checkout develop
git merge --no-ff feature/user-auth  # --no-ff 保留分支历史
git branch -d feature/user-auth
```

### 2.2 变基（Rebase） vs 合并（Merge）

**Merge 保留历史：**
```bash
git checkout feature
git merge main
# 生成合并提交，保留完整分支历史
```

**Rebase 线性历史：**
```bash
git checkout feature
git rebase main
# 将 feature 分支的提交"移动"到 main 分支之后，历史更清晰
```

> ⚠️ 黄金法则：**永远不要在公共分支上使用 rebase**

### 2.3 交互式变基

```bash
# 编辑最近 5 个提交
git rebase -i HEAD~5
```

可用的操作：
- `pick`：保留该提交
- `reword`：修改提交信息
- `edit`：修改提交内容
- `squash`：合并到上一个提交
- `fixup`：合并到上一个提交，丢弃信息
- `drop`：删除该提交

## 3. 提交历史整理

### 3.1 修改最近提交

```bash
# 修改最后一次提交的信息
git commit --amend

# 修改最后一次提交的内容（不改信息）
git add forgotten-file
git commit --amend --no-edit
```

### 3.2 拆分提交

```bash
# 交互式变基，标记需要拆分的提交为 edit
git rebase -i HEAD~3

# 撤销该提交，但保留更改
git reset HEAD^

# 分多次提交
git add part1
git commit -m "feat: part 1"
git add part2
git commit -m "feat: part 2"

git rebase --continue
```

### 3.3 Cherry-pick

```bash
# 选择特定提交应用到当前分支
git cherry-pick abc123         # 单个提交
git cherry-pick abc123 def456  # 多个提交
git cherry-pick abc123..def456 # 提交范围

# 只应用更改，不创建提交
git cherry-pick -n abc123
```

## 4. 撤销与恢复

### 4.1 各种撤销场景

```bash
# 1. 撤销工作区的修改（还没 git add）
git checkout -- file.txt
git restore file.txt           # Git 2.23+

# 2. 撤销暂存（已经 git add，但没 commit）
git reset HEAD file.txt
git restore --staged file.txt  # Git 2.23+

# 3. 撤销提交（已经 commit，但没 push）
git reset --soft HEAD~1        # 撤销提交，更改保留在暂存区
git reset HEAD~1               # 撤销提交，更改保留在工作区
git reset --hard HEAD~1        # 彻底撤销，丢弃所有更改

# 4. 撤销已经 push 的提交
git revert abc123              # 创建一个反向提交，安全！
git push
```

### 4.2 拯救丢失的提交

```bash
# 查看所有操作历史（包括被删除的提交）
git reflog

# 找到丢失的 commit hash，恢复它
git checkout abc123
git checkout -b recovered-branch  # 或创建新分支
```

## 5. 搜索与查找

### 5.1 搜索提交历史

```bash
# 搜索提交信息包含关键词的提交
git log --grep="bugfix"

# 搜索代码内容的变更
git log -S "functionName"        # 字符串搜索
git log -G "regex.*pattern"      # 正则搜索

# 查看某个文件的变更历史
git log --oneline -- src/app.js
git log -p -- src/app.js         # 显示具体变更
```

### 5.2 Bisect 二分查找 Bug

```bash
# 开始二分查找
git bisect start

# 标记当前版本为坏
git bisect bad

# 标记某个已知的好版本
git bisect good v1.2.0

# Git 会自动切换到中间版本，测试后标记
git bisect good    # 这个版本没问题
git bisect bad     # 这个版本有 Bug

# 找到第一个引入 Bug 的提交后，重置
git bisect reset

# 自动化测试
git bisect run npm test
```

## 6. Stash 暂存技巧

```bash
# 暂存当前工作（包括未跟踪文件）
git stash push -m "WIP: user profile feature"
git stash push -u                 # 包含未跟踪文件
git stash push -a                 # 包含忽略文件

# 查看暂存列表
git stash list
git stash show -p stash@{0}       # 查看具体内容

# 应用暂存
git stash apply stash@{1}         # 应用，保留在列表
git stash pop                     # 应用并删除

# 删除暂存
git stash drop stash@{0}
git stash clear                   # 清空所有

# 从暂存创建分支
git stash branch fix-stashed stash@{0}
```

## 7. 高级配置

### 7.1 有用的别名

```bash
# 添加常用别名
git config --global alias.lg "log --oneline --graph --all --decorate"
git config --global alias.st "status -sb"
git config --global alias.co "checkout"
git config --global alias.cm "commit -m"
git config --global alias.br "branch -v"
git config --global alias.df "diff"
git config --global alias.last "log -1 HEAD --stat"

# 查看配置
git config --global --list
```

### 7.2 忽略文件配置

```gitignore
# .gitignore
node_modules/
dist/
build/
*.log
.env
.env.local
.DS_Store
.vscode/
.idea/

# 但不忽略这个文件
!.gitkeep

# 只忽略根目录的文件夹
/tmp

# 全局忽略（所有仓库）
# ~/.gitignore_global
git config --global core.excludesfile ~/.gitignore_global
```

## 8. 协作与 PR 流程

### 8.1 保持 Fork 同步

```bash
# 添加上游仓库
git remote add upstream https://github.com/original/repo.git

# 同步上游更新
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

### 8.2 PR 分支管理

```bash
# 基于最新 main 创建 PR 分支
git checkout main
git pull origin main
git checkout -b feature/new-feature

# PR 更新后，同步主分支的变更
git checkout main
git pull origin main
git checkout feature/new-feature
git rebase main  # 或 git merge main
```

## 9. 大文件与子模块

### 9.1 Git LFS（大文件存储）

```bash
# 安装并初始化
git lfs install

# 追踪大文件类型
git lfs track "*.psd"
git lfs track "*.zip"
git lfs track "assets/**"

git add .gitattributes

# 查看追踪的文件
git lfs ls-files

# 克隆时只下载需要的 LFS 文件
git lfs clone repo-url --include="*.psd" --exclude="*.zip"
```

### 9.2 子模块（Submodule）

```bash
# 添加子模块
git submodule add https://github.com/user/library.git lib/library

# 克隆包含子模块的仓库
git clone --recurse-submodules repo-url

# 初始化并更新子模块
git submodule update --init --recursive

# 更新所有子模块到最新版本
git submodule update --remote --merge
```

## 10. 问题排查

### 10.1 常见问题解决

```bash
# 查找谁写了某行代码
git blame -L 100,120 src/app.js

# 对比两个分支的差异
git diff main..feature-branch
git diff main...feature-branch    # 从共同祖先开始对比

# 查看某个提交改了什么
git show abc123
git show abc123 --stat            # 只看文件列表
```

### 10.2 清理与维护

```bash
# 清理已合并的分支
git branch --merged | grep -v "main" | xargs git branch -d

# 清理远程已删除的分支引用
git remote prune origin

# 垃圾回收，优化仓库大小
git gc --prune=now --aggressive

# 清理历史中的大文件（BFG Repo-Cleaner）
# https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --strip-blobs-bigger-than 100M
```

## 总结

Git 高级技巧要点：

1. **理解 Git 底层原理**：三区模型、对象存储、引用机制
2. **选择合适的工作流**：Git Flow、GitHub Flow、GitLab Flow
3. **善用变基和合并**：保持清晰的提交历史
4. **掌握撤销操作**：reset、revert、reflog 救场神器
5. **高效搜索定位**：bisect、blame、grep 快速定位问题
6. **配置个性化别名**：提升日常操作效率

熟练掌握这些高级技巧，你将成为团队中的 Git 专家，能够轻松应对各种复杂的版本控制场景。
