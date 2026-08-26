import { useMemo, useState } from "react";
import type { PortfolioWork } from "../types";
import { works } from "../data/works";
import { SectionReveal } from "./SectionReveal";
import { WorkCard } from "./WorkCard";
import { WorkDetailModal } from "./WorkDetailModal";

const defaultFilters = ["全部", "AI作品", "实拍作品", "短片", "纪录片", "广告片", "分镜"];

type CollectionGroup = {
  name: string;
  works: PortfolioWork[];
};

export function WorksSection() {
  const [selectedWork, setSelectedWork] = useState<PortfolioWork | null>(null);
  const [activeFilter, setActiveFilter] = useState("全部");
  const filters =
    works.length > 0
      ? [
          "全部",
          ...Array.from(
            new Set(
              works.flatMap((work) => [
                work.category,
                ...(work.tags ?? [])
              ])
            )
          )
        ]
      : defaultFilters;
  const filteredWorks =
    activeFilter === "全部"
      ? works
      : works.filter((work) =>
          [work.category, ...(work.tags ?? [])].includes(activeFilter)
        );

  const { collectionGroups, soloWorks } = useMemo(() => {
    const collectionMap = new Map<string, PortfolioWork[]>();
    const solo: PortfolioWork[] = [];

    filteredWorks.forEach((work) => {
      if (work.collection) {
        const list = collectionMap.get(work.collection) ?? [];
        list.push(work);
        collectionMap.set(work.collection, list);
      } else {
        solo.push(work);
      }
    });

    collectionMap.forEach((list) => {
      list.sort((a, b) => (a.episode ?? 0) - (b.episode ?? 0));
    });

    const groups: CollectionGroup[] = Array.from(collectionMap.entries()).map(
      ([name, list]) => ({ name, works: list })
    );

    return { collectionGroups: groups, soloWorks: solo };
  }, [filteredWorks]);

  return (
    <SectionReveal
      className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-28"
      id="works"
    >
      <div className="scroll-mt-24">
        <div className="max-w-3xl">
          <h2 className="font-serif text-5xl leading-none text-[#1B133C] sm:text-6xl">
            全部作品
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#1B133C]/68">
            AI作品、实拍作品的视觉档案。按标签分类整理，点击影片可查看制作者、职责、片长和创作说明。
          </p>
        </div>

        <div
          className="mt-8 flex flex-wrap gap-2"
          aria-label="作品分类筛选"
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 ${
                  isActive
                    ? "border-[#1B133C] bg-[#1B133C] text-white shadow-[0_12px_32px_rgba(27,19,60,0.18)]"
                    : "border-[#1B133C]/10 bg-white/62 text-[#1B133C]/72 hover:bg-white"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {filteredWorks.length > 0 ? (
          <div className="mt-10 flex flex-col gap-12">
            {collectionGroups.map((group) => (
              <div key={group.name}>
                <div className="mb-5 flex flex-wrap items-baseline gap-3">
                  <h3 className="font-serif text-3xl leading-none text-[#1B133C] sm:text-4xl">
                    {group.name}
                  </h3>
                  <span className="text-xs font-semibold tracking-[0.12em] text-[#1B133C]/55">
                    合集 · 共 {group.works.length} 集
                  </span>
                </div>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {group.works.map((work, index) => (
                    <WorkCard
                      key={`${group.name}-${work.episode ?? index}`}
                      work={work}
                      index={index}
                      onSelect={setSelectedWork}
                    />
                  ))}
                </div>
              </div>
            ))}

            {soloWorks.length > 0 ? (
              <div className={collectionGroups.length > 0 ? "" : ""}>
                {collectionGroups.length > 0 ? (
                  <div className="mb-5 flex flex-wrap items-baseline gap-3">
                    <h3 className="font-serif text-3xl leading-none text-[#1B133C] sm:text-4xl">
                      其他作品
                    </h3>
                  </div>
                ) : null}
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {soloWorks.map((work, index) => (
                    <WorkCard
                      key={work.title}
                      work={work}
                      index={index}
                      onSelect={setSelectedWork}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-10 rounded-xl border border-[#1B133C]/10 bg-white/58 p-8 text-[#1B133C] shadow-[0_18px_60px_rgba(27,19,60,0.07)] backdrop-blur-xl sm:p-10">
            <h3 className="font-serif text-4xl leading-none">
              {works.length > 0 ? "当前分类暂无作品" : "作品待添加"}
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#1B133C]/68">
              这里会展示你后续添加的短片、纪录片、分镜、广告片或实验影像。作品可以写入标题、分类标签、制作者、职责、年份、片长、封面和视频地址。请在
              <code className="mx-1 rounded bg-white/80 px-1.5 py-0.5 text-xs font-semibold">
                src/data/works.ts
              </code>
              中填入真实作品数据。
            </p>
          </div>
        )}
      </div>

      <WorkDetailModal work={selectedWork} onClose={() => setSelectedWork(null)} />
    </SectionReveal>
  );
}
