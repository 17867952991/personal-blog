import { Clapperboard, Film, PenLine } from "lucide-react";
import campusSunset from "../assets/about-campus-sunset.jpg";
import { SectionReveal } from "./SectionReveal";

const skills = [
  "导演",
  "剪辑",
  "摄影",
  "记忆"
];

export function AboutSection() {
  return (
    <SectionReveal className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 md:py-24">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
        <div className="overflow-hidden rounded-xl border border-[#1B133C]/10 bg-white/55 shadow-[0_24px_80px_rgba(27,19,60,0.08)] backdrop-blur-xl">
          <img
            src={campusSunset}
            alt="校园夕阳下的广场与建筑"
            loading="lazy"
            className="h-full min-h-[320px] w-full object-cover sm:min-h-[380px] lg:min-h-[420px]"
          />
        </div>

        <div className="rounded-xl border border-[#1B133C]/10 bg-white/58 p-6 shadow-[0_24px_80px_rgba(27,19,60,0.08)] backdrop-blur-xl sm:p-10">
          <h2 className="font-serif text-5xl leading-none text-[#1B133C] sm:text-6xl">
            关于我
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#1B133C]/70">
            我是一名编导生，希望通过这个网站，可以留存大家在大学期间拍摄的美好影片。
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              { icon: Clapperboard, label: "短片创作" },
              { icon: PenLine, label: "剧本编写" },
              { icon: Film, label: "剪辑" }
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl bg-white/72 p-4 text-sm font-semibold text-[#1B133C]"
              >
                <Icon className="h-4 w-4 text-orange-600" aria-hidden="true" />
                {label}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-xl border border-[#1B133C]/10 bg-white/72 px-3 py-2 text-xs font-semibold text-[#1B133C]/72"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
