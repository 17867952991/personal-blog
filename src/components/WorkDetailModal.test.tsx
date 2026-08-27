import { fireEvent, render, screen, within } from "@testing-library/react";
import { WorkDetailModal } from "./WorkDetailModal";
import type { PortfolioWork } from "../types";

const work: PortfolioWork = {
  title: "海边练习",
  year: "2026",
  category: "实拍作品",
  role: "导演 / 剪辑",
  duration: "03:20",
  coverImage: "/cover.jpg",
  videoUrl: "/film.mp4",
  description: "一支关于校园傍晚和人物独白的短片。",
  directorNote: "把日落留在画面里。",
  creators: ["张三", "李四"],
  stills: [],
  storyboards: [],
  behindTheScenes: [],
  tools: ["Premiere"],
  tags: ["实拍作品", "短片"]
};

describe("WorkDetailModal", () => {
  it("展示影片基础信息和制作者", () => {
    render(<WorkDetailModal work={work} onClose={() => undefined} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "海边练习" })).toBeInTheDocument();
    expect(screen.getByText("影片基础信息")).toBeInTheDocument();
    expect(screen.getByText("制作者")).toBeInTheDocument();
    expect(screen.getByText("张三、李四")).toBeInTheDocument();
    const categoryRow = screen.getByText("类型").closest("div");

    expect(categoryRow).not.toBeNull();
    expect(within(categoryRow as HTMLElement).getByText("实拍作品")).toBeInTheDocument();
    expect(screen.getByText("03:20")).toBeInTheDocument();
  });

  it("提供可操作的视频播放基础控件", () => {
    const { container } = render(
      <WorkDetailModal work={work} onClose={() => undefined} />
    );
    const video = container.querySelector("video");
    const source = container.querySelector("source");

    expect(video).not.toBeNull();
    expect(video).not.toHaveAttribute("controls");
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("preload", "metadata");
    expect(video).toHaveAttribute("poster", "/cover.jpg");
    expect(source).toHaveAttribute("src", "/film.mp4");
    expect(screen.getByRole("button", { name: "播放" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "播放进度" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "静音" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "音量" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "全屏播放" })).toBeInTheDocument();
  });

  it("内容超出屏幕时详情窗口可在内部滚动", () => {
    render(<WorkDetailModal work={work} onClose={() => undefined} />);

    expect(screen.getByRole("dialog")).toHaveClass("overflow-y-auto");
    expect(screen.getByRole("dialog")).toHaveClass("max-h-[calc(100dvh-3rem)]");
  });

  it("展示网盘资源入口和提取码", () => {
    render(
      <WorkDetailModal
        work={{ ...work, resourceUrl: "https://pan.baidu.com/s/RESOURCE", resourceCode: "x65y" }}
        onClose={() => undefined}
      />
    );

    const link = screen.getByRole("link", { name: "打开百度网盘" });
    expect(link).toHaveAttribute("href", "https://pan.baidu.com/s/RESOURCE");
    expect(link).toHaveAttribute("target", "_blank");
    expect(screen.getByText("提取码：").parentElement).toHaveTextContent("提取码：x65y");
  });

  it("播放和暂停按钮控制影片", () => {
    const play = vi.fn().mockResolvedValue(undefined);
    const pause = vi.fn();
    const originalPlay = HTMLMediaElement.prototype.play;
    const originalPause = HTMLMediaElement.prototype.pause;
    HTMLMediaElement.prototype.play = play;
    HTMLMediaElement.prototype.pause = pause;

    try {
      const { container } = render(
        <WorkDetailModal work={work} onClose={() => undefined} />
      );
      const video = container.querySelector("video");

      fireEvent.click(screen.getByRole("button", { name: "播放" }));

      expect(play).toHaveBeenCalledTimes(1);

      if (video) {
        fireEvent.play(video);
      }

      fireEvent.click(screen.getByRole("button", { name: "暂停" }));

      expect(pause).toHaveBeenCalledTimes(1);
    } finally {
      HTMLMediaElement.prototype.play = originalPlay;
      HTMLMediaElement.prototype.pause = originalPause;
    }
  });

  it("进度条可以跳转影片时间", () => {
    const { container } = render(
      <WorkDetailModal work={work} onClose={() => undefined} />
    );
    const video = container.querySelector("video") as HTMLVideoElement;
    Object.defineProperty(video, "duration", {
      configurable: true,
      value: 200
    });

    fireEvent.loadedMetadata(video);
    fireEvent.change(screen.getByRole("slider", { name: "播放进度" }), {
      target: { value: "75" }
    });

    expect(video.currentTime).toBe(75);
  });

  it("音量和静音按钮控制影片声音", () => {
    const { container } = render(
      <WorkDetailModal work={work} onClose={() => undefined} />
    );
    const video = container.querySelector("video") as HTMLVideoElement;

    fireEvent.change(screen.getByRole("slider", { name: "音量" }), {
      target: { value: "0.4" }
    });

    expect(video.volume).toBe(0.4);
    expect(video.muted).toBe(false);

    fireEvent.click(screen.getByRole("button", { name: "静音" }));

    expect(video.muted).toBe(true);
  });

  it("全屏按钮进入播放器全屏", () => {
    const requestFullscreen = vi.fn().mockResolvedValue(undefined);
    const originalRequestFullscreen = HTMLElement.prototype.requestFullscreen;
    HTMLElement.prototype.requestFullscreen = requestFullscreen;

    try {
      render(<WorkDetailModal work={work} onClose={() => undefined} />);

      fireEvent.click(screen.getByRole("button", { name: "全屏播放" }));

      expect(requestFullscreen).toHaveBeenCalledTimes(1);
    } finally {
      HTMLElement.prototype.requestFullscreen = originalRequestFullscreen;
    }
  });
});
