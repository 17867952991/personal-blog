"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveWorkRoute = resolveWorkRoute;
const works_1 = require("../../data/works");
const works_2 = require("../../utils/works");
function resolveWorkRoute(id) {
    return id ? (0, works_2.findWorkById)(works_1.works, id) : undefined;
}
