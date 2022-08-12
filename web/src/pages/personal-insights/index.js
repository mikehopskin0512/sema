import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import SnapshotBar from '../../components/snapshots/snapshotBar';
import { InfoOutlineIcon } from '../../components/Icons';
import { endOfDay, format, isWithinInterval, startOfDay } from 'date-fns';
import Helmet, { PersonalInsightsHelmet } from '../../components/utils/Helmet';
import withLayout from '../../components/layout';
import StatsFilter from '../../components/statsFilter';
import ReactionChart from '../../components/stats/reactionChart';
import TagsChart from '../../components/stats/tagsChart';
import ActivityItemList from '../../components/activity/itemList';
import { commentsOperations } from '../../state/features/comments';
import { DEFAULT_AVATAR, EMOJIS, SEMA_FAQ_SLUGS, SEMA_INTERCOM_FAQ_URL } from '../../utils/constants';
import { filterSmartComments, getEmoji, getEmojiLabel, getTagLabel } from '../../utils/parsing';
import useAuthEffect from '../../hooks/useAuthEffect';
import { gray500 } from '../../../styles/_colors.module.scss';
import SnapshotModal, { SNAPSHOT_DATA_TYPES } from '../../components/snapshots/modalWindow';
import SnapshotButton from '../../components/snapshots/snapshotButton';
import styles from './personal-insights.module.scss';
import Avatar from 'react-avatar';
import { getInsightsGraphsData } from '../../state/features/comments/operations';
import { notify } from '../../components/toaster/index';
import { DATE_RANGES } from '../../components/dateRangeSelector';
import { YEAR_MONTH_DAY_FORMAT } from '../../utils/constants/date';
import SocialCircle from '../../components/repos/socialCircle';
import { SOCIAL_CIRCLE_TYPES } from '../../components/repos/socialCircle/constants';

const { fetchSmartCommentSummary, fetchSmartCommentOverview } =
  commentsOperations;

const formatDate = date =>
  date ? format(new Date(date), YEAR_MONTH_DAY_FORMAT) : null;

const DEFAULT_FILTER = {
  // Default values for month graphs should be predefined
  startDate: formatDate(new Date(DATE_RANGES.last30Days.startDate)),
  endDate: formatDate(new Date(DATE_RANGES.last30Days.endDate)),
  search: '',
  from: [],
  to: [],
  reactions: [],
  tags: [],
  pr: [],
  repo: [],
  dateOption: '',
}

const PersonalInsights = () => {
  const dispatch = useDispatch();
  const { auth, comments } = useSelector((state) => ({
    auth: state.authState,
    comments: state.commentsState,
  }));
  const { token, user } = auth;
  const githubUser = user.identities?.[0];
  const { isFetching } = comments;
  const [totalSmartComments, setTotalSmartComments] = useState(0);
  const [topTags, setTopTags] = useState([]);
  const [topReactions, setTopReactions] = useState([]);
  const [reactionChartData, setReactionChartData] = useState([]);
  const [tagsChartData, setTagsChartData] = useState({});
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [commentView, setCommentView] = useState('received');
  const [filterRepoList, setFilterRepoList] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [outOfRangeComments, setOutOfRangeComments] = useState([]);
  const [dateData, setDateData] = useState({
    groupBy: '',
    startDate: null,
    endDate: null,
    dateDiff: 0,
  });

  const [openReactionsModal, setOpenReactionsModal] = useState(false);
  const [openTagsModal, setOpenTagsModal] = useState(false);
  const [openCommentsModal, setOpenCommentsModal] = useState(false);
  const [componentData, setComponentData] = useState({ yAxisType: 'total' });

  const getUserSummary = async (username) => {
    const params = {
      user: username,
      individual: true,
    };
    dispatch(fetchSmartCommentSummary(params, token));
  };

  const getCommentsOverview = async (filter) => {
    const { username } = githubUser;
    const { startDate, endDate, repo } = filter;
    const params = {
      startDate: startDate ? startOfDay(new Date(startDate)) : undefined,
      endDate: endDate ? endOfDay(new Date(endDate)) : undefined,
    };
    if (commentView === 'given') {
      params.reviewer = username;
    } else {
      params.requester = username;
    }
    if (repo.length > 0) {
      params.externalIds = '';
      repo.forEach((item, index) => {
        params.externalIds += index === 0 ? item.value : `-${item.value}`;
      });
    }
    if ((startDate && endDate) || (!startDate && !endDate)) {
      dispatch(fetchSmartCommentOverview(params, token));
    }
  };

  const getGraphsData = (filter) => {
    const { username } = githubUser;
    const {
      startDate,
      endDate,
      to = [],
      from = [],
      pr = [],
      repo = [],
      reactions = [],
      tags = [],
    } = filter;

    const requestPayload = {
      ...filter,
      from: mapArrToQuery(from),
      to: mapArrToQuery(to),
      pr: mapArrToQuery(pr),
      repo: repo?.map(i => i?.label.split('/')?.[1]),
      reactions: mapArrToQuery(reactions),
      tags: mapArrToQuery(tags),
      startDate: startDate ? startOfDay(new Date(startDate)) : undefined,
      endDate: endDate ? endOfDay(new Date(endDate)) : undefined,
    };

    commentView === 'given' ? requestPayload.reviewer = username : requestPayload.requester = username;

    if (repo.length > 0) {
      requestPayload.externalIds = mapArrToQuery(repo)
        .join('-');
    }

    getInsightsGraphsData(requestPayload, token)
      .then(({
        reactions,
        tags,
        groupBy,
        dateDiff,
        endDay,
        startDay,
      }) => {
        setDateData({
          dateDiff,
          groupBy,
          endDate: endDay,
          startDate: startDay,
        });
        setReactionChartData(reactions);
        setTagsChartData(tags);
      })
      .catch(() => {
        setReactionChartData([]);
        setTagsChartData([]);
        notify("Failed to fetch graphs data", { type: 'error' });
      });
  }

  const getTopReactions = (reactions) => {
    let data = [];
    if (reactions) {
      const sorted = Object.keys(reactions).sort(function (a, b) {
        return reactions[b] - reactions[a];
      });
      data = sorted.map((reaction) => {
        const emoji = getEmoji(reaction);
        const label = getEmojiLabel(reaction);
        return {
          emoji: emoji,
          reactions: reactions[reaction],
          label,
        };
      });
    }
    setTopReactions(data);
  };

  const getTopTags = (tags) => {
    let data = [];
    if (tags) {
      const sorted = Object.keys(tags).sort(function (a, b) {
        return tags[b] - tags[a];
      });
      data = sorted.map((tag) => {
        const label = getTagLabel(tag);
        return {
          [label]: tags[tag],
        };
      });
    }
    setTopTags(data);
  };

  const handleFilter = (value) => {
    setFilter(value);
  };

  const mapArrToQuery = (arr) => arr.map(i => i.value);

  useEffect(() => {
    const { startDate, endDate, groupBy } = dateData;
    if (startDate && endDate && groupBy) {
      setComponentData((oldState) => ({
        ...oldState,
        smartComments: [...filteredComments, ...outOfRangeComments],
        ...dateData,
      }));
    }
  }, [dateData, filteredComments]);

  useEffect(() => {
    getCommentsOverview(filter).then(() => {});
    getGraphsData(filter);
  }, [filter, commentView]);

  useAuthEffect(() => {
    getUserSummary(githubUser?.username);
  }, [auth]);

  useEffect(() => {
    const reposList =
      githubUser.repositories?.filter((item) => item.fullName).map((item) => ({
        name: item.fullName,
        label: item.fullName,
        value: item.id,
      })) || [];
    setFilterRepoList([...reposList]);
  }, [githubUser]);

  useEffect(() => {
    const { summary } = comments;
    getTopReactions(summary.reactions);
    getTopTags(summary.tags);
    setTotalSmartComments(summary?.smartComments?.length);
  }, [comments]);

  const filterComments = (overview) => {
    if (overview && overview.smartComments) {
      const { startDate, endDate } = filter;
      const filtered = filterSmartComments({
        filter,
        smartComments: overview.smartComments,
        startDate: startDate,
        endDate: endDate,
      });
      const isDateRange = startDate && endDate;
      const outOfRangeCommentsFilter = isDateRange
        ? overview.smartComments.filter((comment) => {
            return !isWithinInterval(new Date(comment.source.createdAt), {
              start: startOfDay(new Date(startDate)),
              end: endOfDay(new Date(endDate)),
            });
          })
        : [];
      setFilteredComments(filtered);
      setOutOfRangeComments(outOfRangeCommentsFilter);
    }
  };

  useEffect(() => {
    const { overview } = comments;
    filterComments(overview);
  }, [comments, filter]);

  const renderTopReactions = () => {
    const iterate = topReactions.length >= 1 ? topReactions : EMOJIS;
    return iterate.map((reaction) => {
      const { emoji, reactions = 0, label } = reaction;
      return (
        <>
          <div className="has-background-gray-100 is-flex is-align-items-center mr-8 my-4 px-8 py-0 border-radius-4px">
            <span className="is-size-8 has-text-gray-700 has-text-weight-semibold is-flex is-align-items-center">
              <span className="is-size-6 mr-8">{emoji}</span>{' '}
              {label.toUpperCase()}{' '}
              <strong className="is-size-5 ml-8">{reactions}</strong>
            </span>
          </div>
        </>
      );
    });
  };

  const renderTopTags = () => {
    if (topTags.length >= 1) {
      return topTags.map((tag) => {
        const label = Object.keys(tag);
        return (
          <>
            <div>
              <span className="tag has-text-blue-700 is-primary is-light has-text-weight-semibold mr-5 mb-5 is-uppercase is-size-8 py-16 px-10">
                {label}
              </span>
            </div>
          </>
        );
      });
    }
    return <span className="is-size-8 has-text-gray-500">No tags for now</span>;
  };

  return (
    <>
      <Helmet {...PersonalInsightsHelmet} />
      <div className={`is-hidden-mobile ${styles['page-wrapper']}`}>
        <div className={`has-background-white mb-24 pt-20 ${styles.wrapper}`}>
          <div className="is-flex is-justify-content-space-between">
            <p className="is-flex is-justify-content-center is-align-items-center has-text-black-950 has-text-weight-semibold is-size-3 mb-20 px-15">
              <Avatar
                src={user.avatarUrl || DEFAULT_AVATAR}
                round
                size={40}
                className="mr-20"
              />
              Personal Insights
              <span className="ml-20 is-size-7 has-text-weight-normal is-flex is-align-items-center">
                <InfoOutlineIcon color={gray500} size="medium" />
                <span className="is-size-6 ml-8 has-text-gray-700">
                  Only you can see this page.
                </span>
                <a
                  href={`${SEMA_INTERCOM_FAQ_URL}/${SEMA_FAQ_SLUGS.LEARN_MORE_ABOUT_PERSONAL_INSIGHTS}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <span className="ml-5 has-text-weight-semibold has-text-blue-700">
                    Learn More
                  </span>
                </a>
              </span>
            </p>
          </div>
          <div className="is-flex is-justify-content-space-between p-16">
            <div className={`${styles['comment-wrapper']}`}>
              <p className="is-size-8 has-text-weight-semibold mb-8 has-text-gray-700">
                TOTAL COMMENTS
              </p>
              <span className="is-size-5 has-text-weight-semibold has-text-black-900">
                {totalSmartComments}
              </span>
            </div>
            <div
              className={`is-flex is-flex-grow-1 is-flex-direction-column ${styles['summaries-wrapper']}`}
            >
              <p className="is-size-8 has-text-weight-semibold has-text-gray-700">
                TOTAL SUMMARIES
              </p>
              <div className="is-flex is-flex-wrap-wrap">
                {renderTopReactions()}
              </div>
            </div>
            <div
              className={`is-flex is-flex-grow-1 is-flex-direction-column ${styles['summaries-wrapper']}`}
            >
              <p className="is-size-8 has-text-weight-semibold has-text-gray-700">
                COMMON TAGS
              </p>
              <div className="is-flex is-flex-wrap-wrap mt-4">
                {renderTopTags()}
              </div>
            </div>
            <div className="is-flex is-flex-grow-1 is-flex-direction-column is-justify-content-center">
              <div className="is-flex">
                <button
                  className={clsx(
                    'button border-radius-0 is-small has-text-weight-semibold',
                    commentView === 'received' ? 'is-primary' : ''
                  )}
                  onClick={() => setCommentView('received')}
                >
                  Comments received
                </button>
                <button
                  className={clsx(
                    'button border-radius-0 is-small has-text-weight-semibold',
                    commentView === 'given' ? 'is-primary' : ''
                  )}
                  onClick={() => setCommentView('given')}
                >
                  Comments given
                </button>
              </div>
            </div>
          </div>
        </div>
        <StatsFilter
          filterRepoList={filterRepoList}
          handleFilter={handleFilter}
        />
        <SnapshotBar text="New Feature! Save these charts and comments as Snapshots on your Portfolio." />
        <SocialCircle type={SOCIAL_CIRCLE_TYPES.personal} />
        <div className="is-flex is-flex-wrap-wrap my-20">
          <ReactionChart
            className="ml-neg10"
            reactions={reactionChartData}
            yAxisType="total"
            groupBy={dateData.groupBy}
            onClick={() => setOpenReactionsModal(true)}
            isLoading={isFetching}
          />
          <TagsChart
            className="mr-neg10"
            tags={tagsChartData}
            groupBy={dateData.groupBy}
            onClick={() => setOpenTagsModal(true)}
            dateOption={filter.dateOption}
            isLoading={isFetching}
          />
        </div>
        {openReactionsModal && (
          <SnapshotModal
            dataType={SNAPSHOT_DATA_TYPES.SUMMARIES}
            active={openReactionsModal}
            onClose={() => setOpenReactionsModal(false)}
            snapshotData={{ componentData }}
          />
        )}
        {openTagsModal && (
          <SnapshotModal
            dataType={SNAPSHOT_DATA_TYPES.TAGS}
            active={openTagsModal}
            onClose={() => setOpenTagsModal(false)}
            snapshotData={{ componentData }}
          />
        )}
        {openCommentsModal && (
          <SnapshotModal
            dataType={SNAPSHOT_DATA_TYPES.ACTIVITY}
            active={openCommentsModal}
            onClose={() => setOpenCommentsModal(false)}
            snapshotData={{ componentData }}
          />
        )}
        <div className="is-flex is-align-items-center mb-20">
          <p className="has-text-black-950 has-text-weight-semibold is-size-4 px-15">
            Comments {commentView}
          </p>
          <div>
            {filteredComments.length > 0 && (
              <SnapshotButton onClick={() => setOpenCommentsModal(true)} />
            )}
          </div>
        </div>
        <ActivityItemList comments={filteredComments} isLoading={isFetching} />
      </div>
    </>
  );
};

export default withLayout(PersonalInsights);
