import { Play } from "lucide-react";
import { motion } from "framer-motion";
import type { PortfolioWork } from "../types";

type WorkCardProps = {
  work: PortfolioWork;
  index: number;
  onSelect: (work: PortfolioWork) => void;
};

export function WorkCard({ work, index, onSelect }: WorkCardProps) {
  const visibleTags = Array.from(new Set([work.category, ...(work.tags ?? [])])).slice(0, 3);

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(work)}
      className={`group relative min-h-[420px] overflow-hidden rounded-lg border border-[#1B133C]/10 bg-white/60 text-left shadow-[0_18px_48px_rgba(27,19,60,0.08)] outline-none backdrop-blur-md transition duration-300 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${
        index === 0 ? "md:col-span-2" : ""
      }`}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {work.coverImage ? (
        <img
          src={work.coverImage}
          alt={`${work.title} 影像剧照`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(249,115,22,0.2),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.86),rgba(214,224,239,0.82))]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-white/10" />
      <div className="absolute inset-0 bg-white/0 backdrop-blur-0 transition duration-500 group-hover:bg-white/18 group-hover:backdrop-blur-[2px]" />
      <div className="relative flex h-full min-h-[420px] flex-col justify-end p-5 sm:p-6">
        <div className="mb-auto flex flex-wrap gap-2">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="rounded-xl border border-white/55 bg-white/68 px-3 py-1.5 text-xs font-semibold text-[#1B133C]/72 backdrop-blur-md"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="translate-y-3 transition duration-500 group-hover:translate-y-0">
          <p className="text-sm font-semibold text-[#1B133C]/70">
            {work.year} / {work.category}
          </p>
          <h3 className="mt-2 font-serif text-4xl leading-none text-[#1B133C]">
            {work.title}
          </h3>
          <div className="mt-4 grid gap-1 text-sm font-medium text-[#1B133C]/75 opacity-90 transition duration-500 group-hover:opacity-100">
            {work.collection && work.episode ? (
              <span>
                第 {work.episode} 集 / 共 {work.collectionTotal ?? "?"} 集
              </span>
            ) : work.duration ? (
              <span>{work.duration}</span>
            ) : null}
            <span>{work.role}</span>
            {work.creators && work.creators.length > 0 ? (
              <span>{work.creators.join("、")}</span>
            ) : null}
          </div>
        </div>
        <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-white/75 px-4 py-2 text-sm font-semibold text-[#1B133C] shadow-sm backdrop-blur-md">
          <Play className="h-4 w-4" aria-hidden="true" />
          查看详情
        </span>
      </div>
    </motion.button>
  );
}
