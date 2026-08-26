"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFilters = buildFilters;
exports.filterWorks = filterWorks;
exports.findWorkById = findWorkById;
function buildFilters(works) {
    return [
        "全部",
        ...Array.from(new Set(works.flatMap((work) => [work.category, ...work.tags])))
    ];
}
function filterWorks(works, filter) {
    if (filter === "全部") {
        return works;
    }
    return works.filter((work) => work.category === filter || work.tags.includes(filter));
}
function findWorkById(works, id) {
    return works.find((work) => work.id === id);
}
