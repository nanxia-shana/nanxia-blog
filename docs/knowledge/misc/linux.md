---
layout: doc

lastUpdated: false

---

# Linux 命令行实战技巧

Linux 命令行是开发者和运维人员的必备技能。本文将分享实用的命令行技巧，帮助你提升工作效率，快速解决常见问题。

## 1. Shell 基础增强

### 1.1 常用快捷键

```bash
# 光标移动
Ctrl + A    # 移到行首
Ctrl + E    # 移到行尾
Alt + F     # 向前移动一个单词
Alt + B     # 向后移动一个单词

# 编辑操作
Ctrl + U    # 删除到行首
Ctrl + K    # 删除到行尾
Ctrl + W    # 删除前一个单词
Alt + D     # 删除后一个单词
Ctrl + _    # 撤销上一次操作

# 历史命令
Ctrl + R    # 反向搜索历史（按 Ctrl+R 继续搜索）
Ctrl + G    # 退出搜索
!!          # 执行上一条命令
!$          # 上一条命令的最后一个参数
!*          # 上一条命令的所有参数
```

### 1.2 历史命令技巧

```bash
# 查看历史
history
history 20   # 最近 20 条

# 重复执行第 N 条
!123

# 重复执行最近以 xxx 开头的命令
!ssh
!:p         # 只打印，不执行

# 替换上一条命令的部分内容
^old^new^   # 替换第一个匹配
!!:gs/old/new/g  # 全局替换

# 示例
ssh user@old-server  # 执行后发现输错了
^old^new^            # 变成 ssh user@new-server
```

## 2. 文件操作高级

### 2.1 find 高级用法

```bash
# 基本查找
find /path -name "*.txt"           # 按名称
find /path -iname "*.txt"          # 忽略大小写
find /path -type f -size +10M      # 大于 10M 的文件
find /path -type f -mtime -7       # 7 天内修改的文件
find /path -type f -atime +30      # 30 天没访问过

# 对找到的文件执行操作
find . -name "*.log" -delete       # 删除
find . -name "*.txt" -exec cat {} \;  # 查看内容
find . -name "*.jpg" -exec mv {} ./images/ \;

# 批量重命名
find . -name "*.md" -exec rename 's/old/new/' {} \;

# 查找并压缩
find /logs -name "*.log" -mtime +7 -exec gzip {} \;
```

### 2.2 xargs 高效处理

```bash
# 基本用法
find . -name "*.txt" | xargs rm

# 处理带空格的文件名
find . -name "*.txt" -print0 | xargs -0 rm

# 控制并发数
find . -name "*.jpg" | xargs -P 4 -I {} convert {} {}.png

# 每次处理 N 个参数
echo {1..10} | xargs -n 2 echo
```

### 2.3 批量重命名

```bash
# 方法 1：rename 命令（Perl 版本）
rename 's/\.txt$/.md/' *.txt
rename 'y/A-Z/a-z/' *              # 转小写
rename 's/\s+/_/g' *               # 空格换下划线

# 方法 2：循环 + mv
for file in *.jpg; do
  mv "$file" "vacation_$file"
done

# 方法 3：mmv
mmv "*.txt" "#1.md"
```

## 3. 文本处理三剑客

### 3.1 grep 搜索

```bash
# 基本搜索
grep "error" app.log
grep -i "error" app.log            # 忽略大小写
grep -r "TODO" src/                # 递归搜索
grep -n "TODO" src/                # 显示行号

# 显示上下文
grep -A 5 "error" app.log          # 后 5 行
grep -B 3 "error" app.log          # 前 3 行
grep -C 3 "error" app.log          # 前后各 3 行

# 反向匹配
grep -v "debug" app.log            # 排除 debug 行

# 正则表达式
grep -E "[0-9]{3}-[0-9]{4}" file.txt  # 扩展正则
grep -P "\d{3}-\d{4}" file.txt        # Perl 正则

# 只显示匹配部分
grep -o "http://[^ ]*" access.log

# 统计匹配数
grep -c "error" app.log
```

### 3.2 sed 流编辑器

```bash
# 替换文本
sed 's/old/new/' file.txt          # 替换每行第一个
sed 's/old/new/g' file.txt         # 全局替换
sed -i 's/old/new/g' file.txt      # 原地修改

# 删除行
sed '1,5d' file.txt                # 删除 1-5 行
sed '/pattern/d' file.txt          # 删除匹配行
sed '/^$/d' file.txt               # 删除空行

# 插入/追加
sed '1i\Header' file.txt           # 第一行前插入
sed '$a\Footer' file.txt           # 最后一行后追加

# 提取内容
sed -n '10,20p' file.txt           # 打印 10-20 行
sed -n '/start/,/end/p' file.txt   # 打印两个模式之间的内容

# 多个操作
sed -e 's/foo/bar/g' -e '/^#/d' file.txt
```

### 3.3 awk 文本处理

```bash
# 基本结构：awk 'pattern { action }' file

# 打印指定列
awk '{print $1, $3}' access.log    # 第 1、3 列
awk '{print $NF}' file.txt         # 最后一列

# 条件过滤
awk '$3 > 100' data.txt            # 第 3 列 > 100
awk '$1 == "GET" && $9 == 200' access.log

# 计算统计
awk '{sum += $2} END {print sum}' data.txt   # 求和
awk 'END {print NR}' file.txt                # 行数
awk '!seen[$0]++' file.txt                   # 去重（保持顺序）

# 字段分隔符
awk -F ',' '{print $2}' data.csv    # CSV 文件
awk -F ':' '{print $1}' /etc/passwd

# 格式化输出
awk '{printf "%-20s %s\n", $1, $5}' data.txt

# 处理日志示例
awk '$9 == 500 {print $1}' access.log | sort | uniq -c | sort -rn
```

## 4. 进程与系统管理

### 4.1 ps / top / htop

```bash
# 查看进程
ps aux                          # 所有进程
ps auxf                         # 树形显示
ps -ef | grep nginx

# 查看端口占用
lsof -i :8080
netstat -tulpn | grep :8080
ss -tulpn | grep :8080          # 现代替代

# 实时监控
top -p PID                      # 监控特定进程
top -u username                 # 特定用户

# 进程树
pstree -p
pstree user                     # 用户进程树

# 杀死进程
kill PID                        # 优雅终止
kill -9 PID                     # 强制终止
pkill -f "python.*script"       # 按名称匹配
killall nginx                   # 杀死所有同名进程
```

### 4.2 系统资源监控

```bash
# CPU 信息
cat /proc/cpuinfo
lscpu

# 内存使用
free -h
vmstat 1                        # 每秒刷新
vmstat -s                       # 内存统计

# 磁盘 I/O
iostat -xz 1
iotop                           # 实时 I/O 监控

# 磁盘使用
df -h                           # 磁盘空间
du -sh *                        # 目录大小
du -h --max-depth=1 /var        # 一级目录大小
ncdu                            # 交互式磁盘分析

# 系统负载
uptime
w
cat /proc/loadavg
```

## 5. 网络诊断工具

### 5.1 基础网络命令

```bash
# 连通性测试
ping google.com
ping -c 4 google.com            # 只发 4 个包

# 路由追踪
traceroute google.com
mtr google.com                  # 实时路由追踪

# DNS 查询
dig example.com
dig example.com MX               # MX 记录
dig example.com NS               # NS 记录
nslookup example.com

# 查看本机 IP
ip addr show
hostname -I

# 测试端口
telnet example.com 80
nc -zv example.com 80           # 更现代
nc -zv example.com 1-100        # 扫描端口范围
```

### 5.2 curl 高级用法

```bash
# 基本请求
curl https://api.example.com
curl -I https://example.com     # 只看响应头

# POST 请求
curl -X POST -d "name=John&age=30" https://api.example.com
curl -X POST -H "Content-Type: application/json" -d '{"name":"John"}' url

# 下载文件
curl -O https://example.com/file.zip       # 保存为原名
curl -o output.zip https://example.com/file.zip  # 指定文件名
curl -C - -O https://example.com/file.zip  # 断点续传

# 跟随重定向
curl -L https://example.com

# 显示详细过程
curl -v https://example.com

# 测试响应时间
curl -w "\nTotal: %{time_total}s\nConnect: %{time_connect}s\n" -o /dev/null -s url

# 并发下载
curl -O url1 -O url2 -O url3
```

## 6. 压缩与打包

### 6.1 tar 命令

```bash
# 打包
tar -cvf archive.tar files/          # 仅打包
tar -czvf archive.tar.gz files/      # gzip 压缩
tar -cjvf archive.tar.bz2 files/     # bzip2 压缩
tar -cJvf archive.tar.xz files/      # xz 压缩（最高压缩率）

# 解压
tar -xvf archive.tar
tar -xzvf archive.tar.gz
tar -xjvf archive.tar.bz2
tar -xJvf archive.tar.xz

# 查看内容（不解压）
tar -tvf archive.tar.gz

# 解压到指定目录
tar -xzvf archive.tar.gz -C /tmp/

# 排除文件
tar -czvf backup.tar.gz --exclude="*.log" --exclude="tmp/" /data
```

### 6.2 其他压缩格式

```bash
# zip/unzip
zip -r archive.zip files/
unzip archive.zip
unzip -l archive.zip            # 查看内容
unzip archive.zip -d /tmp/      # 解压到目录

# 7z
7z a archive.7z files/
7z x archive.7z
7z l archive.7z

# 查看压缩文件内容
zcat file.txt.gz                # 直接查看 gz 内容
zless file.txt.gz
zgrep "pattern" file.txt.gz     # 在 gz 中搜索
```

## 7. Shell 脚本技巧

### 7.1 脚本模板

```bash
#!/bin/bash
set -euo pipefail               # 严格模式：出错退出、未定义变量报错、管道失败

# 脚本目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 日志函数
log() { echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"; }
error() { log "ERROR: $*" >&2; exit 1; }

# 参数解析
while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help)
      echo "Usage: $0 [OPTIONS]"
      exit 0
      ;;
    -v|--verbose)
      VERBOSE=1
      shift
      ;;
    *)
      error "Unknown option: $1"
      ;;
  esac
done

# 检查命令是否存在
command -v jq >/dev/null 2>&1 || error "jq is required but not installed"

# 主逻辑
log "Script starting..."
```

### 7.2 实用技巧

```bash
# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 并行执行
for i in {1..10}; do
  ./task.sh "$i" &               # & 后台执行
done
wait                             # 等待所有完成

# 命令行参数处理
args=("$@")                      # 保存所有参数
echo "Number of args: $#"
echo "First arg: $1"

# 数组操作
arr=("a" "b" "c")
echo ${arr[0]}                   # 第一个元素
echo ${arr[@]}                   # 所有元素
echo ${#arr[@]}                  # 数组长度

# 字符串处理
str="Hello World"
echo ${str:0:5}                  # 截取：Hello
echo ${str#Hello}                # 删除前缀
echo ${str%World}                # 删除后缀
echo ${str/World/There}          # 替换第一个
echo ${str//o/O}                 # 全局替换
```

## 8. 终端效率提升

### 8.1 Tmux 终端复用

```bash
# 会话管理
tmux new -s mysession            # 创建命名会话
tmux attach -t mysession         # 重新连接
tmux ls                          # 列出会话
tmux kill-session -t mysession

# 快捷键（Ctrl+b 前缀）
Ctrl+b ?                         # 帮助
Ctrl+b c                         # 新建窗口
Ctrl+b n/p                       # 下一个/上一个窗口
Ctrl+b 0-9                       # 切换到窗口 N
Ctrl+b %                         # 垂直拆分
Ctrl+b "                         # 水平拆分
Ctrl+b 方向键                    # 切换窗格
Ctrl+b d                         # 分离会话
Ctrl+b :                         # 命令模式
```

### 8.2 常用别名推荐

```bash
# ~/.bashrc 或 ~/.zshrc
alias ll='ls -lahF --color=auto'
alias la='ls -A'
alias l='ls -CF'

alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'

alias grep='grep --color=auto'
alias df='df -h'
alias du='du -h'
alias free='free -h'

alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline --graph --all'

# 快速编辑配置
alias ezrc='vim ~/.zshrc'
alias szrc='source ~/.zshrc'
```

## 9. 常见问题解决

### 9.1 文件恢复与清理

```bash
# 找到大文件
find / -type f -size +100M -exec ls -lh {} \; 2>/dev/null

# 找出并删除 30 天前的日志
find /var/log -name "*.log" -mtime +30 -delete

# 清空正在写入的大文件（不重启程序）
> /var/log/huge.log
cat /dev/null > /var/log/huge.log

# 恢复被删除但仍被进程打开的文件
lsof | grep deleted
cat /proc/PID/fd/FD > recovered_file
```

### 9.2 快速查找文件

```bash
# 模糊查找（需要 fzf）
fzf

# 快速定位文件（需要 locate，定期更新 sudo updatedb）
locate filename
locate -i filename              # 忽略大小写

# 最近修改的 10 个文件
find . -type f -printf '%T@ %p\n' | sort -n | tail -10 | cut -f2- -d" "
```

## 总结

Linux 命令行核心技巧：

1. **熟练使用快捷键**：大幅提升编辑效率
2. **掌握文本三剑客**：grep、sed、awk 处理一切文本
3. **善用管道组合**：简单命令组合实现复杂功能
4. **学会系统监控**：top、vmstat、iostat 快速定位问题
5. **编写健壮脚本**：set -euo pipefail、错误处理、日志记录
6. **工具增强终端**：tmux、fzf、zsh 提升交互体验

命令行的魅力在于组合与创造——简单的命令通过管道连接，可以释放出惊人的力量。持续积累和实践，你会发现命令行是你最强大的工具箱。
