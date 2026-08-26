"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const works_1 = require("../../data/works");
const works_2 = require("../../utils/works");
const section_scroll_1 = require("./section-scroll");
const home_works_1 = require("./home-works");
const contact_1 = require("../../utils/contact");
Page({
    data: {
        showreelVideoUrl: works_1.showreelVideoUrl,
        activeFilter: "全部",
        filters: (0, works_2.buildFilters)(works_1.works),
        visibleWorks: (0, works_2.filterWorks)(works_1.works, "全部"),
        contacts: [
            { label: "邮箱", value: "3598938817@qq.com" },
            { label: "QQ", value: "3598938817" },
            { label: "微信", value: "17867952991" }
        ]
    },
    onNavigate(event) {
        this.scrollToTarget(event.detail.target);
    },
    scrollToSection(event) {
        this.scrollToTarget(event.currentTarget.dataset.target);
    },
    scrollToTarget(target) {
        wx.pageScrollTo({
            selector: (0, section_scroll_1.getSectionSelector)(target),
            duration: 300
        });
    },
    selectFilter(event) {
        const activeFilter = event.detail.filter;
        this.setData({
            activeFilter,
            visibleWorks: (0, home_works_1.getVisibleWorks)(activeFilter)
        });
    },
    openWork(event) {
        wx.navigateTo({ url: `/pages/work-detail/index?id=${event.detail.id}` });
    },
    copyContact(event) {
        this.copyContactValueInternal(event.detail.value);
    },
    copyContactValue(event) {
        this.copyContactValueInternal(event.currentTarget.dataset.value);
    },
    copyContactValueInternal(value) {
        (0, contact_1.copyContact)(value, wx, (title) => wx.showToast({ title, icon: "none" }));
    }
});
