# 不免的个人博客

> 一个关于编导专业大学生的作品档案与个人站点。

本站用于集中展示影像作品，当前重点为原创 AI 短片合集《熊出没-修仙篇》（共 3 集）。

## 技术栈

- **构建工具**：[Vite](https://vitejs.dev/) 6
- **前端框架**：[React](https://react.dev/) 19 + TypeScript
- **样式**：[Tailwind CSS](https://tailwindcss.com/) 4
- **动画**：[Framer Motion](https://www.framer.com/motion/)
- **图标**：[lucide-react](https://lucide.dev/)
- **大文件**：[Git LFS](https://git-lfs.com/)（视频资源）

## 功能特性

- 简洁的 Hero 首屏，标题「不免-个人网站」
- 作品按「合集」自动分组展示，单列作品归入「其他作品」
- 合集支持「第 N 集 / 共 N 集」标识
- 点击作品弹出纯视频播放器（极简弹窗）
- 联系方式展示 B 站主页（UID: 498521218）
- 视频资源由 Git LFS 管理，避免仓库体积膨胀

## 目录结构

```
.
├── index.html              # 入口 HTML，标题「不免的个人博客」
├── public/
│   ├── avatar.jpg          # 联系页头像
│   └── videos/             # 作品视频（Git LFS 管理）
├── src/
│   ├── App.tsx             # 页面组装（Hero / Works / Contact）
│   ├── types.ts            # 作品数据类型定义
│   ├── data/
│   │   └── works.ts        # 作品数据（含合集信息）
│   └── components/
│       ├── Hero.tsx            # 首屏
│       ├── WorksSection.tsx    # 作品列表（按合集分组）
│       ├── WorkCard.tsx        # 作品卡片
│       ├── WorkDetailModal.tsx # 视频播放弹窗
│       ├── ContactSection.tsx  # 联系方式
│       ├── BackgroundVideo.tsx # 背景视频
│       └── SectionReveal.tsx   # 滚动入场动画
├── .gitattributes          # Git LFS 规则（*.mp4）
└── package.json
```

## 本地开发

环境要求：Node.js 18+（推荐 22 LTS）。

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://127.0.0.1:5173）
npm run dev

# 类型检查 + 生产构建
npm run build

# 本地预览构建产物
npm run preview

# 运行单元测试
npm test
```

## 关于 Git LFS

视频文件（`*.mp4`）通过 Git LFS 管理。克隆仓库后如需获取视频，请确保已安装 Git LFS：

```bash
git lfs install
git lfs pull
```

## 部署

本站为静态站点，`npm run build` 产物位于 `dist/`，可部署到任意静态托管（如 GitHub Pages、Vercel、Netlify、CloudBase 等）。

## License

私有项目，仅供个人展示使用。
