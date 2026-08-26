import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { works } from "./data/works";

describe("导演作品集", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("渲染中文作品集结构和已上传作品", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: "不免-个人网站"
      })
    ).toBeInTheDocument();

    for (const label of [
      "全部作品",
      "联系我"
    ]) {
      expect(screen.getByRole("heading", { name: label })).toBeInTheDocument();
    }

    expect(works).toHaveLength(4);
    expect(screen.getByRole("heading", { name: "未转头时皆梦" })).toBeInTheDocument();
    expect(screen.queryByText("作品待添加")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "全部" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "AI短片" })).toBeInTheDocument();
  });

  it("打开带作品区锚点的网址时自动滚到全部作品", async () => {
    const scrollIntoView = vi.fn();
    const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = scrollIntoView;
    window.history.replaceState(null, "", "/#works");

    try {
      render(<App />);

      await waitFor(() => {
        expect(scrollIntoView).toHaveBeenCalledWith({
          behavior: "smooth",
          block: "start"
        });
      });
    } finally {
      HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
    }
  });
});
