import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { isEmpty } from 'lodash';
import { endOfDay, startOfDay } from 'date-fns';
import Avatar from 'react-avatar';
import Helmet, { OrganizationInsightsHelmet } from '../../../../components/utils/Helmet';
import withLayout from '../../../../components/layout';
import OrganizationStatsFilter from '../../../../components/organizationStatsFilter';
import TagsChart from '../../../../components/stats/tagsChart';
import ActivityItemList from '../../../../components/activity/itemList';
import { organizationsOperations } from '../../../../state/features/organizations[new]';
import { repositoriesOperations } from '../../../../state/features/repositories';
import { SEMA_FAQ_SLUGS, SEMA_INTERCOM_FAQ_URL } from '../../../../utils/constants';
import { getDateSub, getEmoji, getEmojiLabel, getReactionTagsChartData, getTagLabel, setSmartCommentsDateRange } from '../../../../utils/parsing';
import useAuthEffect from '../../../../hooks/useAuthEffect';
import { blue600, blue700, gray500 } from '../../../../../styles/_colors.module.scss';
import { AuthorIcon, InfoFilledIcon, TeamIcon } from '../../../../components/Icons';
import SnapshotModal, { SNAPSHOT_DATA_TYPES } from '../../../../components/snapshots/modalWindow';
import SnapshotButton from '../../../../components/snapshots/snapshotButton';
import ReactionLineChart from '../../../../components/stats/reactionLineChart';
import styles from '../../../../components/organization/organizationInsights/organizationInsights.module.scss';
import { filterRepoSmartComments } from '../../../../state/features/organizations[new]/actions';
import { useRouter } from 'next/router';

const {
  fetchOrganizationSmartCommentSummary,
  fetchOrganizationSmartCommentOverview,
  fetchOrganizationRepos
} = organizationsOperations;
const { fetchReposByIds } = repositoriesOperations;

const FILTER_DEFAULT_STATE = {
  startDate: null,
  endDate: null,
  search: '',
  from: [],
  to: [],
  reactions: [],
  tags: [],
  pr: [],
  repo: [],
  dateOption: '',
  pageNumber: 1,
  pageSize: 10
};

const OrganizationInsights = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();
  const { auth, organizations } = useSelector(state => ({
    auth: state.authState,
    organizations: state.organizationsNewState
  }))
  const { token, user, selectedOrganization } = auth;
  const { isFetching, insightsData: { searchResults: filteredComments } } = organizations;
  const githubUser = user.identities?.[0];
  const fullName = `${user.firstName} ${user.lastName}`;
  const userId = user._id;

  const [totalSmartComments, setTotalSmartComments] = useState(0);
  const [topTags, setTopTags] = useState([]);
  const [topReactions, setTopReactions] = useState([]);
  const [reactionChartData, setReactionChartData] = useState([]);
  const [tagsChartData, setTagsChartData] = useState({});
  const [filter, setFilter] = useState(FILTER_DEFAULT_STATE);

  const [commentView, setCommentView] = useState('received');
  const [openReactionsModal, setOpenReactionsModal] = useState(false);
  const [openTagsModal, setOpenTagsModal] = useState(false);
  const [openCommentsModal, setOpenCommentsModal] = useState(false);
  const [componentData, setComponentData] = useState({ yAxisType: 'total' });
  const [dateData, setDateData] = useState({
    groupBy: '',
    startDate: null,
    endDate: null,
    dateDiff: 0
  });

  const [isActive, setIsActive] = useState(false);

  const onClickChild = e => {
    e.stopPropagation();
  };

  const onChangeToggle = () => setIsActive(!isActive);

  const getUserSummary = async username => {
    const params = {
      user: username,
      organizationId: selectedOrganization?.organization?._id || '',
      individual: isActive
    };
    dispatch(fetchOrganizationSmartCommentSummary(params, token));
  };

  const getCommentsOverview = async filter => {
    const { username } = githubUser;
    const { startDate, endDate, repo } = filter;
    const params = {
      startDate: startDate ? startOfDay(new Date(startDate)) : undefined,
      endDate: endDate ? endOfDay(new Date(endDate)) : undefined
    };
    if (isActive) {
      if (commentView === 'given') {
        params.reviewer = username;
      } else {
        params.requester = username;
      }
    }
    if (repo.length > 0) {
      params.externalIds = '';
      repo.forEach((item, index) => {
        params.externalIds += index === 0 ? item.value : `-${item.value}`;
      });
    }
    params.organizationId = selectedOrganization?.organization?._id;
    if ((startDate && endDate) || (!startDate && !endDate)) {
      dispatch(fetchOrganizationSmartCommentOverview(params, token));
    }
  };

  const getTopReactions = async reactions => {
    let data = [];
    if (reactions) {
      const sorted = Object.keys(reactions).sort(function(a, b) {
        return reactions[b] - reactions[a];
      });
      data = await Promise.all(
        sorted
          .filter((_, index) => index <= 2)
          .map(async (reaction, index) => {
            if (index <= 2) {
              const emoji = await getEmoji(reaction);
              const label = getEmojiLabel(reaction);
              return {
                [emoji]: { count: reactions[reaction], label  }
              };
            }
          })
      );
    }

    setTopReactions(data);
  };

  const getTopTags = async tags => {
    let data = [];
    if (tags) {
      const sorted = Object.keys(tags).sort(function(a, b) {
        return tags[b] - tags[a];
      });
      data = await Promise.all(
        sorted
          .filter((_, index) => index <= 2)
          .map(async tag => {
            const label = getTagLabel(tag);
            return {
              [label]: tags[tag]
            };
          })
      );
    }
    setTopTags(data);
  };

  const handleFilter = value => {
    setFilter(value);
  };

  useAuthEffect(() => {
    getUserSummary(githubUser?.username);
  }, [auth, isActive]);

  useAuthEffect(() => {
    if (!isEmpty(selectedOrganization)) {
      dispatch(fetchOrganizationRepos({ organizationId: selectedOrganization.organization._id }, token));
    }
  }, []);

  useEffect(() => {
    const { summary } = organizations;
    getTopReactions(summary.reactions);
    getTopTags(summary.tags);
    setTotalSmartComments(summary?.smartComments?.length || 0);
  }, [organizations]);

  useEffect(() => {
    if (!selectedOrganization?.organization?._id) {
      return;
    }
    getCommentsOverview(filter);
  }, [JSON.stringify(filter), commentView, isActive]);

  useAuthEffect(() => {
    const { repos } = selectedOrganization.organizations || {};
    if (repos?.length) {
      const idsParamString = repos.join('-');
      dispatch(fetchReposByIds(idsParamString, token));
    }
  }, [selectedOrganization]);

  const mapFilterValuesToAPI = (filter) => {
    return {
      ...getDateSub(filter.startDate, filter.endDate),
      fromUserList: filter.from.map((f) => (f.value)),
      toUserList: filter.to.map((t) => (t.value)),
      summaries: filter.reactions.map((r) => (r.value)),
      tags: filter.tags.map((t) => (t.value)),
      pullRequests: filter.pr.map((p) => (p.value)),
      repo: filter.repo.map((p) => (p.value)),
      searchQuery: filter.search,
      pageNumber: filter.pageNumber,
      pageSize: filter.pageSize
    }
  }

  const searchSmartComments = (filterData) => {
    const filter = {
      ...mapFilterValuesToAPI(filterData)
    }
    dispatch(
      filterRepoSmartComments(
        query.organizationId,
        token,
        filter
      )
    )
  };

  const getCommentsBounds = (comments) => {
    const sorted = comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) ?? [];
    return { start: sorted[0]?.createdAt, finish: sorted[sorted.length - 1]?.createdAt }
  }

  useEffect(() => {
    searchSmartComments(filter);
  }, [filter]);

  useEffect(() => {
    const { start, finish } = getCommentsBounds(filteredComments);
    const dates = setSmartCommentsDateRange(
      filteredComments,
      filter?.startDate ?? start,
      filter?.endDate ?? finish,
    );
    const {
      startDay,
      endDay,
      dateDiff,
      groupBy,
    } = dates;
    setDateData({
      dateDiff,
      groupBy,
      startDate: new Date(startDay),
      endDate: endDay,
    });
  }, [filteredComments])

  useEffect(() => {
    const { startDate, endDate, groupBy } = dateData;
    if (startDate && endDate && groupBy) {
      const { reactionsChartData, tagsChartData } = getReactionTagsChartData({
        ...dateData,
        smartComments: [...filteredComments]
      });
      setReactionChartData(reactionsChartData);
      setTagsChartData(tagsChartData);
      setComponentData(oldState => ({
        ...oldState,
        smartComments: [...filteredComments],
        ...dateData
      }));
    }
  }, [dateData, filteredComments]);

  useEffect(() => {
    if (isActive && commentView === 'received') {
      setFilter({ ...FILTER_DEFAULT_STATE, to: [{ value: userId }] });
    } else if (isActive && commentView === 'given') {
      setFilter({ ...FILTER_DEFAULT_STATE, from: [{ value: userId }] });
    } else {
     setFilter(FILTER_DEFAULT_STATE)
    }
  }, [isActive, commentView])

  const renderTopReactions = () => {
    return topReactions.map(reaction => {
      const emoji = Object.keys(reaction);
      const value = Object.values(reaction)?.[0];

      return (
        <span className={styles['organization-insights-summary']}>
          <span className="summary-emoji">{emoji}</span>{' '}
          <span className="summary-label">{value?.label}</span>
          <span className="summary-value">{value?.count}</span>
        </span>
      );
    });
  };

  const renderTopTags = () => {
    return topTags.map(tag => {
      const label = Object.keys(tag);
      return (
        <>
          <span className={styles['organization-insights-tag']}>
            {label}
          </span>
        </>
      );
    });
  };

  return (
    <div className="has-background-gray-200">
      <Helmet {...OrganizationInsightsHelmet} />
      <div className="is-divider is-hidden-mobile m-0 p-0 has-background-gray-400" />
      <div className="pb-40 is-hidden-mobile" >
        <div className="has-background-white">
          <div className="container">
          <div className={clsx("is-flex is-justify-content-space-between is-align-items-center has-background-white pb-15 pt-30", styles['organization-insights-header-wrapper'])}>
            <p className="has-text-black-950 has-text-weight-semibold is-size-4 pb-20 pr-15 is-flex is-align-items-center">
              {!isActive && (
                <Avatar
                  name={selectedOrganization?.organization?.name || 'Organization'}
                  src={selectedOrganization?.organization?.avatarUrl}
                  size="35"
                  round
                  textSizeRatio={2.5}
                  maxInitials={2}
                />
              )}
              <span className={isActive ? 'pl-40 is-relative' : 'pl-20'}>
                {isActive && (
                  <>
                    <div
                      style={{
                        width: '35px',
                        height: '40px',
                        paddingLeft: '17px',
                        position: 'absolute',
                        left: '-20px',
                        overflow: 'hidden',
                        zIndex: '10'
                      }}
                    >
                      <Avatar
                        name={fullName}
                        src={user.userAvatar}
                        size="35"
                        round
                        textSizeRatio={2.5}
                        className="mr-10"
                        maxInitials={2}
                      />
                    </div>
                    <div
                      style={{
                        width: '35px',
                        height: '35px',
                        paddingLeft: '17px',
                        borderRadius: '50%',
                        position: 'absolute',
                        left: '-20px',
                        zIndex: '0'
                      }}
                    >
                      <Avatar
                        name={selectedOrganization?.organization?.name || 'Organization'}
                        src={selectedOrganization?.organization?.avatarUrl}
                        size="35"
                        round
                        textSizeRatio={2.5}
                        className="mr-10"
                        maxInitials={2}
                      />
                    </div>
                  </>
                )}
                {isActive ? 'My contributions' : 'Our organization'}
              </span>
              <span className="ml-20 is-size-7 has-text-weight-normal is-relative top-1" style={{ top: 1 }}>
                <InfoFilledIcon
                  color={blue600}
                  size="small"
                  style={{ verticalAlign: 'text-bottom' }}
                />
                <span className="ml-8">
                  {isActive
                    ? 'Only you can see this page.'
                    : 'All your organization members can see this page.'}
                </span>
                <a
                  href={`${SEMA_INTERCOM_FAQ_URL}/${SEMA_FAQ_SLUGS.LEARN_MORE_ABOUT_ORGANIZATION_INSIGHTS}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <span className={clsx("is-underlined ml-5", styles['organization-insights-link'])}>Learn More</span>
                </a>
              </span>
            </p>

            <div className="is-flex pb-20">
              <div
                className="field sema-toggle is-flex is-align-items-center"
                onClick={onClickChild}
                aria-hidden
              >
                <TeamIcon size="medium" color={isActive ? gray500 : blue700} />
                <span
                  className={`px-5 font-weight-600 ${
                    isActive ? 'has-text-gray-500' : 'has-text-blue-700'
                  }`}
                >
                  Everyone
                </span>
                <input
                  id={`activeSwitch`}
                  type="checkbox"
                  onChange={onChangeToggle}
                  name={`activeSwitch`}
                  className="switch is-rounded"
                  checked={isActive}
                />
                <label htmlFor={`activeSwitch`} />
                <AuthorIcon
                  size="medium"
                  color={!isActive ? gray500 : blue700}
                />
                <span
                  className={`px-5 font-weight-600 ${
                    !isActive ? 'has-text-gray-500' : 'has-text-blue-700'
                  }`}
                >
                  Me
                </span>
              </div>
            </div>
          </div>
        {/* </div> */}
        <div className={clsx("column has-background-white", styles['organization-insights-header-wrapper'])}>
          <div className="columns">
            <div className="column is-2 is-flex is-flex-direction-column is-justify-content-flex-start">
              <p className="is-size-8 has-text-grey has-text-weight-semibold mb-5">
                TOTAL COMMENTS
              </p>
              <p className="m-0 is-size-4 has-text-weight-semibold has-text-black-950">
                {totalSmartComments}
              </p>
            </div>
            <div className="column is-3 is-flex is-flex-direction-column is-justify-content-flex-start">
              <p className="is-size-8 has-text-grey has-text-weight-semibold mb-5">
                TOTAL SUMMARIES
              </p>
              <p className="is-flex is-flex-wrap-wrap">
                {renderTopReactions()}
              </p>
            </div>
            <div className="column is-3 is-flex is-flex-direction-column is-justify-content-flex-start">
              <p className="is-size-8 has-text-grey has-text-weight-semibold mb-5">
                COMMON TAGS
              </p>
              <p>{renderTopTags()}</p>
            </div>
            <div className="column is-2 is-flex is-flex-direction-column is-justify-content-flex-start">
              {isActive && (
                <div className="is-flex pt-15">
                  <button
                    className={clsx(
                      'button border-radius-0 is-small',
                      commentView === 'received' ? 'is-primary' : ''
                    )}
                    onClick={() => setCommentView('received')}
                  >
                    Comments received
                  </button>
                  <button
                    className={clsx(
                      'button border-radius-0 is-small',
                      commentView === 'given' ? 'is-primary' : ''
                    )}
                    onClick={() => setCommentView('given')}
                  >
                    Comments given
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
        </div>
        <div className="is-divider is-hidden-mobile m-0 p-0 has-background-gray-400" />
        <div className="container">
        <OrganizationStatsFilter
          filter={filter}
          individualFilter={isActive}
          commentView={commentView}
          handleFilter={handleFilter}
        />
        <div className={clsx("is-flex is-flex-wrap-wrap my-20", styles['line-graph-wrapper'])}>
          <ReactionLineChart
            reactions={reactionChartData}
            groupBy={dateData.groupBy}
            onClick={() => setOpenReactionsModal(true)}
            isLoading={isFetching}
          />
          <TagsChart
            isOrganizationView
            className='mr-neg10'
            tags={tagsChartData}
            groupBy={dateData.groupBy}
            onClick={() => setOpenTagsModal(true)}
            dateOption={filter.dateOption}
            isLoading={isFetching}
          />
        </div>
        {openReactionsModal && (
          <SnapshotModal
            dataType={SNAPSHOT_DATA_TYPES.SUMMARIES_AREA}
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
        <div className='is-flex is-align-items-center mb-20'>
          <p className='has-text-black-950 has-text-weight-semibold is-size-4 px-15'>Comments {commentView}</p>
          {!isFetching && (
            <div>
              <SnapshotButton onClick={() => setOpenCommentsModal(true)} />
            </div>
          )}
        </div>
          <ActivityItemList comments={filteredComments} isLoading={isFetching} setFilter={setFilter} isPaginationNeeded  />
        </div>
      </div>
    </div>
  );
};

export default withLayout(OrganizationInsights);
