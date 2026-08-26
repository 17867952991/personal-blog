import { SectionReveal } from "./SectionReveal";

export function DirectorStatement() {
  return (
    <SectionReveal
      id="statement"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8 md:py-24"
    >
      <div className="rounded-xl border border-[#1B133C]/10 bg-white/58 p-6 shadow-[0_24px_80px_rgba(27,19,60,0.08)] backdrop-blur-xl sm:p-10 md:p-14">
        <h2 className="font-serif text-5xl leading-none text-[#1B133C] sm:text-6xl">
          导演阐述
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <p className="font-serif text-3xl italic leading-[1.16] text-[#1B133C] sm:text-4xl">
            希望通过这些作品，可以让大家更好的了解我，了解我的团队。
          </p>
          <p className="text-base leading-relaxed text-[#1B133C]/70">
            我关注人与人之间不被说出口的情绪，也关注空间、记忆和时间如何改变一个人的状态。我的创作常常从一次停顿、一个眼神、一间人离开后的房间开始，然后把它发展成影像、节奏和叙事。
          </p>
        </div>
      </div>
    </SectionReveal>
  );
}
