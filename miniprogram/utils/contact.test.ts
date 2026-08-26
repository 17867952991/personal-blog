import { expect, it, vi } from "vitest";
import { copyContact } from "./contact";

it("复制联系信息后提示成功", () => {
  const setClipboardData = vi.fn(({ success }) => success?.());
  const notify = vi.fn();

  copyContact("3598938817@qq.com", { setClipboardData }, notify);

  expect(setClipboardData).toHaveBeenCalledWith(
    expect.objectContaining({ data: "3598938817@qq.com" })
  );
  expect(notify).toHaveBeenCalledWith("已复制到剪贴板");
});
