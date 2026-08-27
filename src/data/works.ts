import type { PortfolioWork } from "../types";

// 兼容 GitHub Pages 的项目子路径（/personal-blog/）。
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const xiongchumoResourceUrl = "https://pan.baidu.com/s/1WabwFmyRmkPO_p4v2QSw-g";
const xiongchumoResourceCode = "x65y";

export const showreelVideoUrl =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260714_113715_c7e0daa0-8bdd-4486-a2da-040901f8f0ea.mp4";

// 后续把你的真实作品对象添加到这个数组里，页面会自动生成分类、卡片和详情弹窗。
// 常用字段：title、year、category、role、duration、creators、coverImage、videoUrl、description、tags。
// 合集字段：collection（合集名）、episode（集数）、collectionTotal（总集数）。
export const works: PortfolioWork[] = [
  {
    title: "未转头时皆梦",
    year: "2026",
    category: "AI短片",
    role: "待补充",
    duration: "03:53",
    coverImage: asset("videos/weizhuantoushi-jiemeng-poster.jpg"),
    videoUrl: "/videos/weizhuantoushi-jiemeng.mp4",
    description: "作品信息待补充。",
    directorNote: "待补充。",
    format: "MP4 / 1920x1080",
    tags: ["AI短片", "影片"]
  },
  {
    title: "熊出没-修仙篇",
    year: "2026",
    category: "AI短片",
    role: "AI短片 / 漫剧",
    duration: "",
    coverImage: asset("videos/xiongchumo-xiuxian-01-preview.gif"),
    videoUrl: "/videos/xiongchumo-xiuxian-01.mp4",
    format: "MP4",
    resourceUrl: xiongchumoResourceUrl,
    resourceCode: xiongchumoResourceCode,
    tags: ["AI短片", "漫剧", "合集"],
    collection: "熊出没-修仙篇",
    episode: 1,
    collectionTotal: 3
  },
  {
    title: "熊出没-修仙篇",
    year: "2026",
    category: "AI短片",
    role: "AI短片 / 漫剧",
    duration: "",
    coverImage: asset("videos/xiongchumo-xiuxian-02-preview.gif"),
    videoUrl: "/videos/xiongchumo-xiuxian-02.mp4",
    format: "MP4",
    resourceUrl: xiongchumoResourceUrl,
    resourceCode: xiongchumoResourceCode,
    tags: ["AI短片", "漫剧", "合集"],
    collection: "熊出没-修仙篇",
    episode: 2,
    collectionTotal: 3
  },
  {
    title: "熊出没-修仙篇",
    year: "2026",
    category: "AI短片",
    role: "AI短片 / 漫剧",
    duration: "",
    coverImage: asset("videos/xiongchumo-xiuxian-03-preview.gif"),
    videoUrl: "/videos/xiongchumo-xiuxian-03.mp4",
    format: "MP4",
    resourceUrl: xiongchumoResourceUrl,
    resourceCode: xiongchumoResourceCode,
    tags: ["AI短片", "漫剧", "合集"],
    collection: "熊出没-修仙篇",
    episode: 3,
    collectionTotal: 3
  }
];
