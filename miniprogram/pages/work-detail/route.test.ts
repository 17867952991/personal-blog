import { describe, expect, it } from "vitest";
import { resolveWorkRoute } from "./route.ts";

describe("作品详情路由", () => {
  it("解析有效作品 id", () => {
    expect(resolveWorkRoute("weizhuantoushi-jiemeng")?.duration).toBe("03:53");
  });

  it("对缺失或无效 id 返回 undefined", () => {
    expect(resolveWorkRoute()).toBeUndefined();
    expect(resolveWorkRoute("not-found")).toBeUndefined();
  });
});
