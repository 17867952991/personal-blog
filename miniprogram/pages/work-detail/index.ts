import type { PortfolioWork } from "../../data/works";
import { resolveWorkRoute } from "./route";

type DetailRow = { label: string; value: string };

function createDetailRows(work: PortfolioWork): DetailRow[] {
  return [
    { label: "制作者", value: work.creators?.join("、") || "待补充" },
    { label: "职责", value: work.role },
    { label: "类型", value: work.category },
    { label: "年份", value: work.year },
    { label: "片长", value: work.duration },
    { label: "格式", value: work.format || "待补充" },
    { label: "拍摄地点", value: work.location || "待补充" }
  ];
}

Page({
  data: {
    work: null as PortfolioWork | null,
    detailRows: [] as DetailRow[],
    archive: [] as string[],
    tags: [] as string[],
    missing: false
  },

  onLoad(options: { id?: string }) {
    const work = resolveWorkRoute(options.id);

    if (!work) {
      this.setData({ missing: true });
      return;
    }

    this.setData({
      work,
      detailRows: createDetailRows(work),
      archive: [...(work.stills || []), ...(work.storyboards || []), ...(work.behindTheScenes || [])],
      tags: Array.from(new Set([...work.tags, ...(work.tools || [])]))
    });
  },

  returnHome() {
    wx.reLaunch({ url: "/pages/home/index" });
  }
});
