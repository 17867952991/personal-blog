export type PortfolioWork = {
  id: string;
  title: string;
  year: string;
  category: string;
  role: string;
  duration: string;
  coverImage: string;
  videoUrl: string;
  description: string;
  directorNote: string;
  creators?: string[];
  stills?: string[];
  storyboards?: string[];
  behindTheScenes?: string[];
  tools?: string[];
  tags: string[];
  format?: string;
  location?: string;
};

export const showreelVideoUrl = "/assets/videos/weizhuantoushi-jiemeng.mp4";

export const works: PortfolioWork[] = [
  {
    id: "weizhuantoushi-jiemeng",
    title: "未转头时皆梦",
    year: "2026",
    category: "AI短片",
    role: "待补充",
    duration: "03:53",
    coverImage: "/assets/images/weizhuantoushi-jiemeng-poster.jpg",
    videoUrl: "/assets/videos/weizhuantoushi-jiemeng.mp4",
    description: "作品信息待补充。",
    directorNote: "待补充。",
    format: "MP4 / 1920x1080",
    tags: ["AI短片", "影片"]
  }
];
