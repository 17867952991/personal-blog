import { describe, expect, it } from "vitest";
import { getSectionSelector } from "./section-scroll";

describe("主页锚点", () => {
  it("将区块名称转换为页面滚动选择器", () => {
    expect(getSectionSelector("works")).toBe("#works");
  });
});
