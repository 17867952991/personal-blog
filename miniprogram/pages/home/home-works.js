"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisibleWorks = getVisibleWorks;
const works_1 = require("../../data/works");
const works_2 = require("../../utils/works");
function getVisibleWorks(filter) {
    return (0, works_2.filterWorks)(works_1.works, filter);
}
