export const setFacetItem = (group: string) => ([
  {$group: {_id: '$'+group, count: {$sum: 1}}},
  {$project: {value: "$_id", count: "$count", _id: 0}},
  {$sort: {value: 1}}
])

export const setFacetArrow = (group: string) => ([
  {$unwind: {path: '$'+group}},
  {$project: {[group]: true, count: {$add: [1]}}},
  {$group: {_id: '$'+group, count: {$sum: "$count"}}},
  {$project: {value: "$_id", count: "$count", _id: 0}},
  {$sort: {value: 1}}
])

