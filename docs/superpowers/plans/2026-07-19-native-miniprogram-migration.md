# 原生微信小程序迁移 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (\`- [ ]\`) syntax for tracking.

**Goal:** 将当前导演作品集完整迁移为可在微信开发者工具中打开的原生 TypeScript 小程序。

**Architecture:** 新建独立的 \`miniprogram/\` 工程，使用一个可滚动的主页承载网站的六个内容区块，使用独立作品详情页承载影片资料。纯业务逻辑置于 \`miniprogram/utils/\`，以 Vitest 测试；页面与组件只负责调用这些逻辑和渲染。

**Tech Stack:** 原生微信小程序、TypeScript、WXML、WXSS、Vitest 3。

## Global Constraints

- 只在 \`miniprogram/\` 下创建迁移后的应用，不改动现有 React/Vite 网站。
- 页面必须使用原生小程序 API、WXML、WXSS 与 TypeScript，不引入 React、Taro、Tailwind、Framer Motion 或图标库。
- 保留首屏、作品、样片、导演阐述、关于、联系六个内容区块和现有作品数据。
- 使用原生 \`video\` 控件；远程视频地址必须由小程序合法域名配置支持。
- 每一个新增业务函数均先写并运行失败的 Vitest 测试，再写最小实现。
- 小程序工程必须可直接通过 \`project.config.json\` 导入微信开发者工具。

---

## File Structure

~~~text
miniprogram/
├── app.json
├── app.ts
├── app.wxss
├── project.config.json
├── sitemap.json
├── data/works.ts
├── utils/works.ts
├── utils/contact.ts
├── utils/works.test.ts
├── utils/contact.test.ts
├── assets/images/about-campus-sunset.jpg
├── assets/images/weizhuantoushi-jiemeng-poster.jpg
├── assets/videos/weizhuantoushi-jiemeng.mp4
├── components/portfolio-nav/*
├── components/filter-chips/*
├── components/work-card/*
├── components/section-heading/*
├── components/contact-card/*
└── pages/
    ├── home/*
    └── work-detail/*
~~~

### Task 1: 创建工程、迁移资源和作品查询逻辑

**Files:**

- Create: \`miniprogram/project.config.json\`
- Create: \`miniprogram/app.json\`
- Create: \`miniprogram/app.ts\`
- Create: \`miniprogram/app.wxss\`
- Create: \`miniprogram/sitemap.json\`
- Create: \`miniprogram/data/works.ts\`
- Create: \`miniprogram/utils/works.ts\`
- Create: \`miniprogram/utils/works.test.ts\`
- Create: \`miniprogram/assets/images/about-campus-sunset.jpg\`
- Create: \`miniprogram/assets/images/weizhuantoushi-jiemeng-poster.jpg\`
- Create: \`miniprogram/assets/videos/weizhuantoushi-jiemeng.mp4\`

**Interfaces:**

- Produces \`PortfolioWork\`, \`works\`, \`showreelVideoUrl\`, \`buildFilters(works)\`, \`filterWorks(works, filter)\` and \`findWorkById(works, id)\`.
- \`PortfolioWork\` has \`id\`, \`title\`, \`year\`, \`category\`, \`role\`, \`duration\`, \`coverImage\`, \`videoUrl\`, \`description\`, \`directorNote\`, \`tags\` and optional archive fields.

- [ ] **Step 1: Write the failing test**

~~~ts
import { describe, expect, it } from "vitest";
import { buildFilters, filterWorks, findWorkById } from "./works";
import { works } from "../data/works";

describe("作品数据查询", () => {
  it("生成全部加去重分类标签", () => {
    expect(buildFilters(works)).toEqual(["全部", "AI短片", "影片"]);
  });

  it("按标签筛选作品", () => {
    expect(filterWorks(works, "AI短片").map((work) => work.id)).toEqual([
      "weizhuantoushi-jiemeng"
    ]);
  });

  it("按 id 返回作品或 undefined", () => {
    expect(findWorkById(works, "weizhuantoushi-jiemeng")?.title).toBe("未转头时皆梦");
    expect(findWorkById(works, "missing")).toBeUndefined();
  });
});
~~~

- [ ] **Step 2: Run test to verify it fails**

Run: \`npm test -- miniprogram/utils/works.test.ts\`

Expected: FAIL because \`./works\` and \`../data/works\` do not exist.

- [ ] **Step 3: Write minimal implementation**

~~~ts
export function buildFilters(works: PortfolioWork[]): string[] {
  return ["全部", ...Array.from(new Set(works.flatMap((work) => [work.category, ...work.tags])))];
}

export function filterWorks(works: PortfolioWork[], filter: string): PortfolioWork[] {
  return filter === "全部"
    ? works
    : works.filter((work) => work.category === filter || work.tags.includes(filter));
}

export function findWorkById(works: PortfolioWork[], id: string): PortfolioWork | undefined {
  return works.find((work) => work.id === id);
}
~~~

Copy the existing \`about-campus-sunset.jpg\`, video poster, and MP4 into the paths above. Define the existing work with ID \`weizhuantoushi-jiemeng\` and use relative \`/assets/...\` paths.

- [ ] **Step 4: Add minimal app configuration**

~~~json
{
  "pages": ["pages/home/index", "pages/work-detail/index"],
  "window": { "navigationBarTitleText": "光影寄存处", "navigationBarBackgroundColor": "#f7f7fb", "navigationBarTextStyle": "black", "backgroundColor": "#f7f7fb" },
  "style": "v2",
  "sitemapLocation": "sitemap.json"
}
~~~

Set \`project.config.json\` to \`"miniprogramRoot": "./"\` and set \`compileType\` to \`miniprogram\`.

- [ ] **Step 5: Run test to verify it passes**

Run: \`npm test -- miniprogram/utils/works.test.ts\`

Expected: PASS with three tests.

- [ ] **Step 6: Commit**

Skip because \`C:\\Users\\dwc\\Desktop\\个人网站\` is not a Git repository. Record this fact in the handoff.

### Task 2: 实现首页结构与锚点导航

**Files:**

- Create: \`miniprogram/pages/home/index.ts\`
- Create: \`miniprogram/pages/home/index.wxml\`
- Create: \`miniprogram/pages/home/index.wxss\`
- Create: \`miniprogram/pages/home/index.json\`
- Create: \`miniprogram/pages/home/section-scroll.ts\`
- Create: \`miniprogram/pages/home/section-scroll.test.ts\`
- Create: \`miniprogram/components/portfolio-nav/index.ts\`
- Create: \`miniprogram/components/portfolio-nav/index.wxml\`
- Create: \`miniprogram/components/portfolio-nav/index.wxss\`
- Create: \`miniprogram/components/portfolio-nav/index.json\`

**Interfaces:**

- Homepage owns \`activeFilter\`, \`filters\`, and \`visibleWorks\` data.
- \`scrollToSection(event)\` consumes \`event.currentTarget.dataset.target\` and invokes \`wx.pageScrollTo({ selector: '#' + target, duration: 300 })\`.
- Navigation emits \`navigate\` with \`{ target: string }\`.

- [ ] **Step 1: Write the failing test**

~~~ts
import { describe, expect, it } from "vitest";
import { getSectionSelector } from "./section-scroll";

describe("主页锚点", () => {
  it("将区块名称转换为页面滚动选择器", () => {
    expect(getSectionSelector("works")).toBe("#works");
  });
});
~~~

- [ ] **Step 2: Run test to verify it fails**

Run: \`npm test -- miniprogram/pages/home/section-scroll.test.ts\`

Expected: FAIL because \`section-scroll.ts\` does not exist.

- [ ] **Step 3: Write minimal implementation and homepage shell**

~~~ts
export function getSectionSelector(target: string): string {
  return \`#\${target}\`;
}
~~~

In \`index.ts\`, initialize data using \`buildFilters(works)\` and \`filterWorks(works, "全部")\`; implement \`onNavigate\`, \`scrollToSection\`, \`selectFilter\`, and \`openWork\`. In \`index.wxml\`, add sections with IDs \`top\`, \`works\`, \`showreel\`, \`statement\`, \`about\`, and \`contact\`, including the hero heading \`光影寄存处\` and its two action buttons.

- [ ] **Step 4: Run test to verify it passes**

Run: \`npm test -- miniprogram/pages/home/section-scroll.test.ts\`

Expected: PASS.

- [ ] **Step 5: Commit**

Skip because the workspace is not a Git repository.

### Task 3: 实现筛选和作品卡片组件

**Files:**

- Create: \`miniprogram/components/filter-chips/index.ts\`
- Create: \`miniprogram/components/filter-chips/index.wxml\`
- Create: \`miniprogram/components/filter-chips/index.wxss\`
- Create: \`miniprogram/components/filter-chips/index.json\`
- Create: \`miniprogram/components/work-card/index.ts\`
- Create: \`miniprogram/components/work-card/index.wxml\`
- Create: \`miniprogram/components/work-card/index.wxss\`
- Create: \`miniprogram/components/work-card/index.json\`
- Modify: \`miniprogram/pages/home/index.wxml\`
- Modify: \`miniprogram/pages/home/index.wxss\`

**Interfaces:**

- \`filter-chips\` accepts \`filters: string[]\` and \`active: string\`, emits \`change\` with \`{ filter }\`.
- \`work-card\` accepts \`work: PortfolioWork\`, emits \`select\` with \`{ id }\`.
- Homepage handles events with \`selectFilter\` and \`openWork\` from Task 2.

- [ ] **Step 1: Write the failing test**

~~~ts
import { describe, expect, it } from "vitest";
import { filterWorks } from "../../utils/works";
import { works } from "../../data/works";

describe("首页作品展示", () => {
  it("切换到未命中标签时返回空列表", () => {
    expect(filterWorks(works, "纪录片")).toEqual([]);
  });
});
~~~

- [ ] **Step 2: Run test to verify it fails**

Run: \`npm test -- miniprogram/pages/home/home-works.test.ts\`

Expected: FAIL because the test file has not yet been created.

- [ ] **Step 3: Write minimal component implementation**

Use component properties for strings and arrays, \`triggerEvent("change", { filter })\` in filter chips, and \`triggerEvent("select", { id: this.properties.work.id })\` in the card. Render the cards in homepage WXML with:

~~~xml
<filter-chips filters="{{filters}}" active="{{activeFilter}}" bind:change="selectFilter" />
<view class="works-grid">
  <work-card wx:for="{{visibleWorks}}" wx:key="id" work="{{item}}" bind:select="openWork" />
</view>
<view wx:if="{{visibleWorks.length === 0}}" class="empty-state">当前分类暂无作品</view>
~~~

- [ ] **Step 4: Run test to verify it passes**

Run: \`npm test -- miniprogram/pages/home/home-works.test.ts\`

Expected: PASS.

- [ ] **Step 5: Commit**

Skip because the workspace is not a Git repository.

### Task 4: 实现作品详情页与无效路由兜底

**Files:**

- Create: \`miniprogram/pages/work-detail/index.ts\`
- Create: \`miniprogram/pages/work-detail/index.wxml\`
- Create: \`miniprogram/pages/work-detail/index.wxss\`
- Create: \`miniprogram/pages/work-detail/index.json\`
- Create: \`miniprogram/pages/work-detail/route.ts\`
- Create: \`miniprogram/pages/work-detail/route.test.ts\`

**Interfaces:**

- \`resolveWorkRoute(id?: string): PortfolioWork | undefined\` reads \`works\` through \`findWorkById\`.
- Page data has \`work: PortfolioWork | null\` and \`missing: boolean\`.
- \`onLoad({ id })\` sets \`work\` when valid and \`missing\` otherwise.

- [ ] **Step 1: Write the failing test**

~~~ts
import { describe, expect, it } from "vitest";
import { resolveWorkRoute } from "./route";

describe("作品详情路由", () => {
  it("解析有效作品 id", () => {
    expect(resolveWorkRoute("weizhuantoushi-jiemeng")?.duration).toBe("03:53");
  });

  it("对缺失或无效 id 返回 undefined", () => {
    expect(resolveWorkRoute()).toBeUndefined();
    expect(resolveWorkRoute("not-found")).toBeUndefined();
  });
});
~~~

- [ ] **Step 2: Run test to verify it fails**

Run: \`npm test -- miniprogram/pages/work-detail/route.test.ts\`

Expected: FAIL because \`route.ts\` does not exist.

- [ ] **Step 3: Write minimal implementation**

~~~ts
import { works } from "../../data/works";
import { findWorkById } from "../../utils/works";

export function resolveWorkRoute(id?: string) {
  return id ? findWorkById(works, id) : undefined;
}
~~~

Render title, metadata, \`video\` with \`src\`, \`poster\`, \`controls\`, \`show-fullscreen-btn\`, description, director note, information rows, archive images and tag chips for a valid work. Render \`未找到这部作品\` and a \`返回主页\` button when \`missing\` is true.

- [ ] **Step 4: Run test to verify it passes**

Run: \`npm test -- miniprogram/pages/work-detail/route.test.ts\`

Expected: PASS with two tests.

- [ ] **Step 5: Commit**

Skip because the workspace is not a Git repository.

### Task 5: 完成静态内容区与联系复制功能

**Files:**

- Create: \`miniprogram/components/section-heading/*\`
- Create: \`miniprogram/components/contact-card/*\`
- Create: \`miniprogram/utils/contact.ts\`
- Create: \`miniprogram/utils/contact.test.ts\`
- Modify: \`miniprogram/pages/home/index.ts\`
- Modify: \`miniprogram/pages/home/index.wxml\`
- Modify: \`miniprogram/pages/home/index.wxss\`

**Interfaces:**

- \`copyContact(value: string, api: { setClipboardData(options: { data: string; success?: () => void }): void }, notify: (title: string) => void): void\`.
- \`contact-card\` emits \`copy\` with \`{ value }\`; homepage calls \`copyContact\` with \`wx\` and \`wx.showToast\`.

- [ ] **Step 1: Write the failing test**

~~~ts
import { expect, it, vi } from "vitest";
import { copyContact } from "./contact";

it("复制联系信息后提示成功", () => {
  const setClipboardData = vi.fn(({ success }) => success?.());
  const notify = vi.fn();
  copyContact("3598938817@qq.com", { setClipboardData }, notify);
  expect(setClipboardData).toHaveBeenCalledWith(expect.objectContaining({ data: "3598938817@qq.com" }));
  expect(notify).toHaveBeenCalledWith("已复制到剪贴板");
});
~~~

- [ ] **Step 2: Run test to verify it fails**

Run: \`npm test -- miniprogram/utils/contact.test.ts\`

Expected: FAIL because \`contact.ts\` does not exist.

- [ ] **Step 3: Write minimal implementation and content sections**

~~~ts
export function copyContact(value: string, api: ClipboardApi, notify: (title: string) => void): void {
  api.setClipboardData({ data: value, success: () => notify("已复制到剪贴板") });
}
~~~

Add the existing showreel, director statement, about image and text, skills, email, QQ and WeChat contact cards to homepage WXML. The sample video uses \`showreelVideoUrl\`; all contact cards and the primary button use the copy event.

- [ ] **Step 4: Run test to verify it passes**

Run: \`npm test -- miniprogram/utils/contact.test.ts\`

Expected: PASS.

- [ ] **Step 5: Commit**

Skip because the workspace is not a Git repository.

### Task 6: 全量验证与微信开发者工具导入

**Files:**

- Modify: \`miniprogram/app.wxss\` only if import inspection exposes a styling defect.
- Modify: \`miniprogram/project.config.json\` only if developer tools cannot resolve the project root.

**Interfaces:**

- No new interfaces.

- [ ] **Step 1: Run the full automated test suite**

Run: \`npm test\`

Expected: PASS for existing React tests and every new \`miniprogram/**/*.test.ts\` test.

- [ ] **Step 2: Run TypeScript checks for the existing application**

Run: \`npm run build\`

Expected: PASS. Existing web build output remains unchanged apart from standard generated \`dist/\` files.

- [ ] **Step 3: Import in WeChat Developer Tools**

Use the “导入” action and select \`C:\\Users\\dwc\\Desktop\\个人网站\\miniprogram\`. Verify that the tool recognizes \`project.config.json\`, opens the homepage, and loads all local resources.

- [ ] **Step 4: Exercise functional acceptance checks**

Verify: each navigation target scrolls correctly; the \`AI短片\` chip filters and \`全部\` restores the card; the card opens the matching detail page; the video has controls and supports fullscreen; an invalid detail path shows \`未找到这部作品\`; and each contact item copies its visible value.

- [ ] **Step 5: Commit**

Skip because the workspace is not a Git repository. Hand off the modified local files and validation results.

## Plan Self-Review

- Spec coverage: Tasks 1–5 cover the requested native project, resources, all six homepage sections, filtering, detail video view, invalid route state, and contact copying. Task 6 covers automated checks and developer-tools validation.
- Placeholder scan: no unresolved implementation or validation placeholders remain.
- Type consistency: all route resolution uses \`findWorkById\`, homepage selection emits work IDs, and detail routes consume the same \`PortfolioWork\` type.
