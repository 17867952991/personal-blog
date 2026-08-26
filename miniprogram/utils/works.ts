import type { PortfolioWork } from "../data/works";

export function buildFilters(works: PortfolioWork[]): string[] {
  return [
    "全部",
    ...Array.from(
      new Set(works.flatMap((work) => [work.category, ...work.tags]))
    )
  ];
}

export function filterWorks(
  works: PortfolioWork[],
  filter: string
): PortfolioWork[] {
  if (filter === "全部") {
    return works;
  }

  return works.filter(
    (work) => work.category === filter || work.tags.includes(filter)
  );
}

export function findWorkById(
  works: PortfolioWork[],
  id: string
): PortfolioWork | undefined {
  return works.find((work) => work.id === id);
}
