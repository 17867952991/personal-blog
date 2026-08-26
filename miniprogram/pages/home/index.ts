import { showreelVideoUrl, works } from "../../data/works";
import { buildFilters, filterWorks } from "../../utils/works";
import { getSectionSelector } from "./section-scroll";
import { getVisibleWorks } from "./home-works";
import { copyContact } from "../../utils/contact";

Page({
  data: {
    showreelVideoUrl,
    activeFilter: "全部",
    filters: buildFilters(works),
    visibleWorks: filterWorks(works, "全部"),
    contacts: [
      { label: "邮箱", value: "3598938817@qq.com" },
      { label: "QQ", value: "3598938817" },
      { label: "微信", value: "17867952991" }
    ]
  },

  onNavigate(event: WechatMiniprogram.CustomEvent<{ target: string }>) {
    this.scrollToTarget(event.detail.target);
  },

  scrollToSection(event: WechatMiniprogram.TouchEvent) {
    this.scrollToTarget(event.currentTarget.dataset.target);
  },

  scrollToTarget(target: string) {
    wx.pageScrollTo({
      selector: getSectionSelector(target),
      duration: 300
    });
  },

  selectFilter(event: WechatMiniprogram.CustomEvent<{ filter: string }>) {
    const activeFilter = event.detail.filter;

    this.setData({
      activeFilter,
      visibleWorks: getVisibleWorks(activeFilter)
    });
  },

  openWork(event: WechatMiniprogram.CustomEvent<{ id: string }>) {
    wx.navigateTo({ url: `/pages/work-detail/index?id=${event.detail.id}` });
  },

  copyContact(event: WechatMiniprogram.CustomEvent<{ value: string }>) {
    this.copyContactValueInternal(event.detail.value);
  },

  copyContactValue(event: WechatMiniprogram.TouchEvent) {
    this.copyContactValueInternal(event.currentTarget.dataset.value);
  },

  copyContactValueInternal(value: string) {
    copyContact(value, wx, (title) => wx.showToast({ title, icon: "none" }));
  }
});
