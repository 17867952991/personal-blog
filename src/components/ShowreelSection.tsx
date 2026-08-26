import { SectionReveal } from "./SectionReveal";

type ShowreelSectionProps = {
  videoUrl: string;
};

export function ShowreelSection({ videoUrl }: ShowreelSectionProps) {
  return (
    <SectionReveal
      id="showreel"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-5 py-16 sm:px-8 md:py-24"
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.4fr] lg:items-end">
        <div className="max-w-xl">
          <h2 className="font-serif text-5xl leading-none text-[#1B133C] sm:text-6xl">
            代表样片
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#1B133C]/68">
            用大尺寸影像容器展示当前代表剪辑。之后可以直接替换为最终 showreel 或预告片。
          </p>
        </div>

        <div className="rounded-xl border border-white/70 bg-white/58 p-3 shadow-[0_24px_80px_rgba(27,19,60,0.12)] backdrop-blur-2xl sm:p-4">
          <div className="relative overflow-hidden rounded-lg bg-[#1B133C]/8">
            <video
              controls
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="aspect-video w-full object-cover"
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute left-4 top-4 rounded-xl border border-white/70 bg-white/62 px-3 py-2 text-xs font-semibold text-[#1B133C] shadow-sm backdrop-blur-md">
              代表样片 / 2026
            </div>
            <div className="pointer-events-none absolute bottom-4 right-4 rounded-xl border border-white/70 bg-white/62 px-3 py-2 font-mono text-xs font-semibold text-[#1B133C] shadow-sm backdrop-blur-md">
              00:00:08:12
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
