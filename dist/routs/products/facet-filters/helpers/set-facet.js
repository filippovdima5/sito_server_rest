"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFacetItem = (group) => ([
    { $group: { _id: '$' + group, count: { $sum: 1 } } },
    { $project: { value: "$_id", count: "$count", _id: 0 } },
    { $sort: { value: 1 } }
]);
exports.setFacetArrow = (group) => ([
    { $unwind: { path: '$' + group } },
    { $project: { [group]: true, count: { $add: [1] } } },
    { $group: { _id: '$' + group, count: { $sum: "$count" } } },
    { $project: { value: "$_id", count: "$count", _id: 0 } },
    { $sort: { value: 1 } }
]);
