import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ReactionChart from './reactionChart';
import TagsChart from './tagsChart';
import { setSmartCommentsDateRange, getReactionTagsChartData, filterSmartComments } from '../../utils/parsing';
import SnapshotModal, { SNAPSHOT_DATA_TYPES } from '../snapshots/modalWindow';

const StatsPage = ({ startDate, endDate, filter }) => {
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
        <ReactionChart reactions={reactions} groupBy={groupBy} onClick={() => setOpenReactionsModal(true)}/>
        <TagsChart tags={tags} groupBy={groupBy} onClick={() => setOpenTagsModal(true)}/>
        {openReactionsModal && <SnapshotModal dataType={SNAPSHOT_DATA_TYPES.SUMMARIES} active={openReactionsModal} onClose={()=>setOpenReactionsModal(false)} snapshotData={{ componentData }}/>}
        {openTagsModal && <SnapshotModal dataType={SNAPSHOT_DATA_TYPES.TAGS} active={openTagsModal} onClose={()=>setOpenTagsModal(false)} snapshotData={{ componentData }}/>}
      </div>
    </>
  );
};

export default StatsPage;
