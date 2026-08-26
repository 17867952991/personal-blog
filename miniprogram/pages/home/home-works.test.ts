import { describe, expect, it } from "vitest";
import { getVisibleWorks } from "./home-works.ts";

describe("首页作品展示", () => {
  it("切换到未命中标签时返回空列表", () => {
    expect(getVisibleWorks("纪录片")).toEqual([]);
  });

  it("切换到作品标签时返回对应作品", () => {
    expect(getVisibleWorks("AI短片").map((work) => work.id)).toEqual([
      "weizhuantoushi-jiemeng"
    ]);
  });
});
