const SNAPSHOTS_TYPES = {
  COMMENTS: "comments",
  OTHER: "other",
};

const ELEM_TYPES = {
  ROW: "row",
  COLUMN: "column",
};

const COMPONENTS_TYPES = {
  CHART: 'chart',
  COMMENTS: 'comments',
  EMPTY: 'empty'
}

const ACCEPTABLE_ITEMS = [ELEM_TYPES.COLUMN, ELEM_TYPES.ROW];

const DND_CASES_CHECKS = {
  EMPTY_CHARTS_ROW: (data, position) => data[position]?.children?.every(i => i.isEmpty),
  EMPTY_CHILDREN_ROW: (item) => item.children?.every(child => child.isEmpty),
  IS_INDEPENDENT_ROW: (item) => !!item.data.isIndependent,
  SAME_ROW_ITEMS: (start, finish) => start[0] === finish[0],
  DIFF_ROWS_ITEMS: (start, finish) => start.length !== finish.length
}

export {
  SNAPSHOTS_TYPES,
  ACCEPTABLE_ITEMS,
  ELEM_TYPES,
  COMPONENTS_TYPES,
  DND_CASES_CHECKS
};
