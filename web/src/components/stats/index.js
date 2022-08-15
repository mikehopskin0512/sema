import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import TagsChart from './tagsChart';
import SnapshotModal, { SNAPSHOT_DATA_TYPES } from '../snapshots/modalWindow';
import ReactionLineChart from './reactionLineChart';
import { repositoriesOperations } from '../../state/features/repositories';
import { notify } from '../toaster/index';

const {
  getChartsData,
} = repositoriesOperations;

const StatsPage = ({
  startDate,
  endDate,
  filter: unsafeFilter,
  isLoading,
}) => {
  const { auth, repositories } = useSelector((state) => ({
    repositories: state.repositoriesState,
    auth: state.authState,
  }));

  const {
    token,
  } = auth;

  const { data } = repositories;

  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [reactions, setReactions] = useState([]);
  const [tags, setTags] = useState({});
  const [groupBy, setGroupBy] = useState('');
  const [openReactionsModal, setOpenReactionsModal] = useState(false);
  const [openTagsModal, setOpenTagsModal] = useState(false);
  const [componentData] = useState({
    yAxisType: 'total',
    startDate,
    endDate,
  });

  const filter = useMemo(() => ({
    ...unsafeFilter,
    from: [],
    to: [],
  }), [unsafeFilter, startDate, endDate]);

  useEffect(() => {
    if (token) {
      const {
        from = [],
        to = [],
        pr = [],
        reactions = [],
        tags = [],
        search = '',
      } = filter;

      const query = {
        repoId: data?.overview._id,
        startDate: startDate ? startDate.toString() : null,
        endDate: endDate ? endDate.toString() : null,
        requesters: from,
        receivers: to,
        pullRequests: pr,
        reactions: reactions.map(r => r.value),
        tags: tags.map(t => t.value),
      };

      if (search?.length) {
        query.search = search;
      }

      getChartsData(query, token)
        .then(({
          tags,
          reactions,
          groupBy,
          endDay,
          startDay,
        }) => {
          setReactions(reactions);
          setTags(tags);
          setStart(startDay);
          setEnd(endDay);
          setGroupBy(groupBy);
        }).catch(() => {
          notify('Error while fetching graphs data', { type: 'error' })
          setReactions([]);
          setTags([]);
      });
    }
  }, [token, startDate, endDate, filter]);

  return (
    <>
      <div className='is-flex is-flex-wrap-wrap mt-10'>
        <ReactionLineChart reactions={reactions} groupBy={groupBy} onClick={() => setOpenReactionsModal(true)} isLoading={isLoading} />
        <TagsChart
          tags={tags}
          groupBy={groupBy}
          onClick={() => setOpenTagsModal(true)}
          startDate={start}
          endDate={end}
          dateOption={filter.dateOption}
        />
        {openReactionsModal &&
          <SnapshotModal
            dataType={SNAPSHOT_DATA_TYPES.SUMMARIES_AREA}
            active={openReactionsModal}
            onClose={() => setOpenReactionsModal(false)}
            snapshotData={{ componentData }}
          />}
        {openTagsModal && (
          <SnapshotModal
            dataType={SNAPSHOT_DATA_TYPES.TAGS}
            active={openTagsModal}
            onClose={() => setOpenTagsModal(false)}
            snapshotData={{ componentData }}
          />)}
      </div>
    </>
  );
};

export default StatsPage;
