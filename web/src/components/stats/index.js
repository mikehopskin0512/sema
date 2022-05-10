import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import ReactionChart from './reactionChart';
import TagsChart from './tagsChart';
import { setSmartCommentsDateRange, getReactionTagsChartData, filterSmartComments } from '../../utils/parsing';
import SnapshotModal, { SNAPSHOT_DATA_TYPES } from '../snapshots/modalWindow';
import ReactionLineChart from './reactionLineChart';

const StatsPage = ({ startDate, endDate, filter: unsafeFilter, isLoading }) => {
  const { repositories } = useSelector((state) => ({
    repositories: state.repositoriesState,
  }));

  const { data: { overview } } = repositories;

  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [dateDiff, setDateDiff] = useState(0);
  const [reactions, setReactions] = useState([]);
  const [tags, setTags] = useState({});
  const [groupBy, setGroupBy] = useState('');
  const [openReactionsModal, setOpenReactionsModal] = useState(false);
  const [openTagsModal, setOpenTagsModal] = useState(false);
  const [componentData, setComponentData] = useState({ yAxisType: 'total', startDate, endDate });

  // Code stats should not display data from individual users.
  const filter = useMemo(() => ({ ...unsafeFilter, from: [], to: [] }), [ unsafeFilter ]);

  useEffect(() => {
    if (overview?.smartcomments && overview?.smartcomments.length > 0) {
      const dates = setSmartCommentsDateRange(overview.smartcomments, startDate, endDate);
      const { startDay, endDay, dateDiff, groupBy } = dates;
      setStart(startDay);
      setEnd(endDay);
      setDateDiff(dateDiff);
      setGroupBy(groupBy);
    }
  }, [overview]);

  useEffect(() => {
    if (start && end && groupBy) {
      const filtered = filterSmartComments({ filter, smartComments: overview.smartcomments, start, end });
      setComponentData((state) => ({ ...state, smartComments: filtered, dateDiff, groupBy, startDate: start, endDate: end }));
      const { reactionsChartData, tagsChartData } = getReactionTagsChartData({
        startDate: start,
        endDate: end,
        groupBy: groupBy,
        smartComments: filtered,
        dateDiff,
      });
      setReactions(reactionsChartData);
      setTags(tagsChartData);
    }
  }, [start, end, groupBy, filter]);

  return(
    <>
      <div className="is-flex is-flex-wrap-wrap mt-10">
        <ReactionLineChart reactions={reactions} groupBy={groupBy}  onClick={() => setOpenReactionsModal(true)} isLoading={isLoading} />
        <TagsChart tags={tags} groupBy={groupBy} onClick={() => setOpenTagsModal(true)} startDate={start} endDate={end} dateOption={filter.dateOption} />
        {openReactionsModal && <SnapshotModal dataType={SNAPSHOT_DATA_TYPES.SUMMARIES_AREA} active={openReactionsModal} onClose={()=>setOpenReactionsModal(false)} snapshotData={{ componentData }}/>}
        {openTagsModal && <SnapshotModal dataType={SNAPSHOT_DATA_TYPES.TAGS} active={openTagsModal} onClose={()=>setOpenTagsModal(false)} snapshotData={{ componentData }}/>}
      </div>
    </>
  );
};

export default StatsPage;
