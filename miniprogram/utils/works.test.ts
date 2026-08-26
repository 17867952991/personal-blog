import { describe, expect, it } from "vitest";
import { works } from "../data/works";
import { buildFilters, filterWorks, findWorkById } from "./works";

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
