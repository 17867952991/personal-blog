"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = require("./route");
function createDetailRows(work) {
    var _a;
    return [
        { label: "制作者", value: ((_a = work.creators) === null || _a === void 0 ? void 0 : _a.join("、")) || "待补充" },
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
        work: null,
        detailRows: [],
        archive: [],
        tags: [],
        missing: false
    },
    onLoad(options) {
        const work = (0, route_1.resolveWorkRoute)(options.id);
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
