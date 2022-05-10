import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import clsx from 'clsx'
import { findIndex, isEmpty, uniqBy } from 'lodash';
import { endOfDay, isWithinInterval, startOfDay } from 'date-fns';
import Avatar from 'react-avatar';
import Helmet, { TeamInsightsHelmet } from '../../../../components/utils/Helmet';
import withLayout from '../../../../components/layout';
import TeamStatsFilter from '../../../../components/teamStatsFilter';
import TagsChart from '../../../../components/stats/tagsChart';
import ActivityItemList from '../../../../components/activity/itemList';
import { teamsOperations } from "../../../../state/features/teams";
import { repositoriesOperations } from "../../../../state/features/repositories";
import { DEFAULT_AVATAR, SEMA_INTERCOM_FAQ_URL, SEMA_FAQ_SLUGS } from '../../../../utils/constants';
import { getEmoji, getTagLabel, setSmartCommentsDateRange, getReactionTagsChartData, filterSmartComments } from '../../../../utils/parsing';
import useAuthEffect from '../../../../hooks/useAuthEffect';
import { blue600, blue700, gray500 } from '../../../../../styles/_colors.module.scss';
import { AuthorIcon, TeamIcon, InfoFilledIcon } from '../../../../components/Icons';
import SnapshotModal, { SNAPSHOT_DATA_TYPES } from '../../../../components/snapshots/modalWindow';
import SnapshotButton from '../../../../components/snapshots/snapshotButton';
import ReactionLineChart from '../../../../components/stats/reactionLineChart';

const { fetchTeamSmartCommentSummary, fetchTeamSmartCommentOverview, fetchTeamRepos } = teamsOperations;
const { fetchReposByIds } = repositoriesOperations;

const TeamInsights = () => {
  const dispatch = useDispatch();
  const { auth, teams } = useSelector((state) => ({
    auth: state.authState,
    teams: state.teamsState,
  }));
  const { token, user, selectedTeam } = auth;
  const githubUser = user.identities?.[0];
  const fullName = `${user.firstName} ${user.lastName}`;

  const [totalSmartComments, setTotalSmartComments] = useState(0);
  const [topTags, setTopTags] = useState([])
  const [topReactions, setTopReactions] = useState([])
  const [reactionChartData, setReactionChartData] = useState([]);
  const [tagsChartData, setTagsChartData] = useState({});
  const [filter, setFilter] = useState({
    startDate: null,
    endDate: null,
    search: '',
    from: [],
    to: [],
    reactions: [],
    tags: [],
    pr: [],
    repo: [],
  });
  const [commentView, setCommentView] = useState('received');
  const [filterUserList, setFilterUserList] = useState([]);
  const [filterRequesterList, setFilterRequesterList] = useState([]);
  const [filterPRList, setFilterPRList] = useState([]);
  const [filterRepoList, setFilterRepoList] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [outOfRangeComments, setOutOfRangeComments] = useState([]);
  const [openReactionsModal, setOpenReactionsModal] = useState(false);
  const [openTagsModal, setOpenTagsModal] = useState(false);
  const [openCommentsModal, setOpenCommentsModal] = useState(false);
  const [componentData, setComponentData] = useState({ yAxisType: 'total' });
  const [dateData, setDateData] = useState({
    groupBy: '',
    startDate: null,
    endDate: null,
    dateDiff: 0,
  });

  const [isActive, setIsActive] = useState(false);

  const onClickChild = (e) => {
    e.stopPropagation();
  };

  const onChangeToggle = () => setIsActive(!isActive);

  const getUserSummary = async (username) => {
    const params = {
      user: username,
      teamId: selectedTeam?.team?._id || '',
      individual: isActive,
    };
    dispatch(fetchTeamSmartCommentSummary(params, token));
  };

  const getCommentsOverview = async (filter) => {
    const { username } = githubUser;
    const { startDate, endDate, repo } = filter;
    const params = {
      startDate: startDate ? startOfDay(new Date(startDate)) : undefined,
      endDate: endDate ? endOfDay(new Date(endDate)) : undefined,
    }
    if (isActive) {
      if (commentView === 'given') {
        params.reviewer = username
      } else {
        params.requester = username
      }
    }
    if(repo.length > 0) {
      params.externalIds = '';
      repo.forEach((item, index) => {
        params.externalIds += index === 0 ? item.value : `-${item.value}`;
      });
    }
    params.teamId = selectedTeam?.team?._id;
    if ((startDate && endDate) || (!startDate && !endDate)) {
      dispatch(fetchTeamSmartCommentOverview(params, token));
    }
  };

  const getTopReactions = async (reactions) => {
    let data = [];
    if (reactions) {
      const sorted = Object.keys(reactions).sort(function (a, b) { return reactions[b] - reactions[a] })
      data = await Promise.all(sorted.filter((_, index) => index <= 2).map(async (reaction, index) => {
        if (index <= 2) {
          const emoji = await getEmoji(reaction)
          return {
            [emoji]: reactions[reaction]
          }
        }
      }));
    }
    setTopReactions(data);
  };

  const getTopTags = async (tags) => {
    let data = [];
    if (tags) {
      const sorted = Object.keys(tags).sort(function (a, b) { return tags[b] - tags[a] })
      data = await Promise.all(sorted.filter((_, index) => index <= 2).map(async (tag) => {
        const label = getTagLabel(tag);
        return {
          [label]: tags[tag]
        }
      }));
    }
    setTopTags(data);
  };

  const handleFilter = (value) => {
    setFilter(value)
  };

  useEffect(() => {
    const { overview } = teams;
    const { startDate, endDate } = filter;
    if (overview?.smartComments && overview?.smartComments.length > 0) {
      const dates = setSmartCommentsDateRange(overview.smartComments, startDate, endDate);
      const { startDay, endDay, dateDiff, groupBy } = dates;
      setDateData({
        dateDiff,
        groupBy,
        startDate: new Date(startDay),
        endDate: endDay,
      })
    }
  }, [teams, filter]);

  useEffect(() => {
    const { startDate, endDate, groupBy } = dateData;
    if (startDate && endDate && groupBy) {
      const { reactionsChartData, tagsChartData } = getReactionTagsChartData({
        ...dateData,
        smartComments: [...filteredComments, ...outOfRangeComments],
      });
      setReactionChartData(reactionsChartData);
      setTagsChartData(tagsChartData);
      setComponentData((oldState) => ({ ...oldState, smartComments: [...filteredComments, ...outOfRangeComments], ...dateData }));
    }
  }, [dateData, filteredComments]);

  useAuthEffect(() => {
    getUserSummary(githubUser?.username);
  }, [auth, isActive]);

  useAuthEffect(() => {
    if(!isEmpty(selectedTeam)){
      dispatch(fetchTeamRepos({ teamId: selectedTeam.team._id }, token));
    }
  }, []);

  useEffect(() => {
    const reposList = teams?.repos.map(({ name, externalId }) => (
      {
        name,
        label: name,
        value: externalId,
      })) || [];
    setFilterRepoList([...reposList]);
  }, [teams]);

  useEffect(() => {
    const { summary } = teams;
    getTopReactions(summary.reactions);
    getTopTags(summary.tags);
    setTotalSmartComments(summary?.smartComments?.length || 0)
  }, [teams]);

  useEffect(() => {
    if (!selectedTeam?.team?._id) {
      return
    }
    getCommentsOverview(filter);
  }, [JSON.stringify(filter), commentView, isActive]);

  useAuthEffect(() => {
    const { repos } = selectedTeam.team || {};
    if (repos?.length) {
      const idsParamString = repos.join('-');
      dispatch(fetchReposByIds(idsParamString, token));
    }
  }, [selectedTeam]);

  const setFilterValues = (overview) => {
    if (!overview?.smartComments?.length) {
      return;
    }
    const requesters = overview.smartComments
      .filter((item) => item.githubMetadata.requester)
      .map((({ githubMetadata }) => {
        return {
          label: githubMetadata.requester,
          value: githubMetadata.requester,
          img: githubMetadata.requesterAvatarUrl || DEFAULT_AVATAR,
        }
      }))
    const users = overview.smartComments.filter((item) => item.userId).map((item) => {
      const { firstName = '', lastName = '', _id = '', avatarUrl = '', username = 'User@email.com' } = item.userId;
      return {
        label: isEmpty(firstName) && isEmpty(lastName) ? username.split('@')[0] : `${firstName} ${lastName}`,
        value: _id,
        img: isEmpty(avatarUrl) ? DEFAULT_AVATAR : avatarUrl,
      };
    });
    const prs = overview.smartComments.filter((item) => item.githubMetadata).map((item) => {
      const { githubMetadata: { head, title = '', pull_number: pullNum = '' } } = item;
      const prName = title || head || 'Pull Request';
      return {
        label: `${prName} (#${pullNum || '0'})`,
        value: pullNum,
        name: prName,
      };
    });
    let filteredPRs = []
    prs.forEach((item) => {
      const index = findIndex(filteredPRs, { value: item.value });
      if (index !== -1) {
        if (isEmpty(filteredPRs[index].prName)) {
          filteredPRs[index] = item;
        }
      } else {
        filteredPRs.push(item);
      }
    });
    setFilterRequesterList(uniqBy(requesters, 'value'))
    setFilterUserList(uniqBy(users, 'value'));
    setFilterPRList(filteredPRs);
  }

  const filterComments = (overview) => {
    if (overview && overview.smartComments) {
      const { startDate, endDate} = filter;
      const filtered = filterSmartComments({
        filter,
        smartComments: overview.smartComments,
        startDate: startDate,
        endDate: endDate,
      });
      const isDateRange = startDate && endDate;
      const outOfRangeCommentsFilter = isDateRange ? overview.smartComments.filter((comment) => {
        return !isWithinInterval(new Date(comment.createdAt), {
          start: startOfDay(new Date(startDate)),
          end: endOfDay(new Date(endDate)),
        })
      }) : [];
      setFilteredComments(filtered);
      setOutOfRangeComments(outOfRangeCommentsFilter);
    }
  };

  useEffect(() => {
    const { overview } = teams;
    filterComments(overview);
    setFilterValues(overview);
  }, [JSON.stringify(filter), teams]);

  const renderTopReactions = () => {
    return topReactions.map((reaction) => {
      const emoji = Object.keys(reaction);
      const value = Object.values(reaction);
      return (
        <span className="is-align-items-center is-flex is-flex-grow-1">
          <span className="px-5 is-size-5">{emoji}</span> <span className="is-size-6 pr-10 has-text-black-950">{value}</span>
        </span>
      )
    })
  };

  const renderTopTags = () => {
    return topTags.map((tag) => {
      const label = Object.keys(tag);
      return (
        <>
          <span className="tag is-rounded is-primary is-light has-text-weight-semibold mr-5 mb-5 is-uppercase is-size-8">{label}</span>
        </>
      )
    })
  };

  return (
    <div className="has-background-gray-200">
      <Helmet {...TeamInsightsHelmet} />
      <div className="is-divider is-hidden-mobile m-0 p-0 has-background-gray-400"/>
      <div className="pb-40 is-hidden-mobile">
        <div>
          <div className="is-flex is-justify-content-space-between has-background-white pb-15 pt-30">
            <p className="has-text-black-950 has-text-weight-semibold is-size-4 pb-20 px-15">
              {!isActive ?
                          <Avatar
                          name={selectedTeam?.team?.name || "Team"}
                          src={selectedTeam?.team?.avatarUrl}
                          size="35"
                          round
                          textSizeRatio={2.5}
                          maxInitials={2}
                        />
               : <>
            <div style={{width: '35px', height: '40px', paddingLeft: '17px', position:'absolute', left: '-3px', overflow:'hidden', zIndex: '10'}}>
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
            <div style={{width: '35px', height: '35px', paddingLeft: '17px', borderRadius: '50%', position: 'absolute', left: '-3px', zIndex: '0'}}>
            <Avatar
              name={selectedTeam?.team?.name || "Team"}
              src={selectedTeam?.team?.avatarUrl}
              size="35"
              round
              textSizeRatio={2.5}
              className="mr-10"
              maxInitials={2}
            />
            </div></>}
              <span className={isActive ? "pl-40 ml-40" : "pl-20 ml-20"}>{isActive ? 'My contributions' : 'Our team'}</span>
              <span className="ml-20 is-size-7 has-text-weight-normal">
                <InfoFilledIcon
                  color={blue600}
                  size="small"
                  style={{ verticalAlign: 'text-bottom' }}
                />
                <span className="ml-8">
                  {isActive ? 'Only you can see this page.' : 'All your team members can see this page.'}
                </span>
                <a href={`${SEMA_INTERCOM_FAQ_URL}/${SEMA_FAQ_SLUGS.LEARN_MORE_ABOUT_TEAM_INSIGHTS}`} target="_blank" rel="noreferrer noopener">
                  <span className="is-underlined ml-5">
                    Learn More
                  </span>
                </a>
              </span>
            </p>

            <div className="is-flex pt-10 pr-100">
            <div className="field sema-toggle is-flex is-align-items-center" onClick={onClickChild} aria-hidden>
                 <TeamIcon size="small" color={isActive ? gray500 : blue700}/>
                 <span className={`px-5 ${isActive ? 'has-text-gray-500' : 'has-text-blue-700'}`}>Everyone</span>
                  <input
                    id={`activeSwitch`}
                    type="checkbox"
                    onChange={onChangeToggle}
                    name={`activeSwitch`}
                    className="switch is-rounded"
                    checked={isActive}
                  />
                  <label htmlFor={`activeSwitch`} />
                  <AuthorIcon size="small" color={!isActive ? gray500 : blue700}/>
                  <span className={`px-5 ${!isActive ? 'has-text-gray-500' : 'has-text-blue-700'}`}>Me</span>
                </div>
            </div>
          </div>
        </div>
        <div className="column has-background-white">
              <div className="columns">
                <div className="column is-2 is-flex is-flex-direction-column is-justify-content-space-between">
                  <p className="is-size-8 has-text-grey has-text-weight-semibold mb-5">
                    TOTAL COMMENTS
                  </p>
                  <p className="m-0 is-size-4 has-text-weight-semibold has-text-black-950">{totalSmartComments}</p>
                </div>
                <div className="column is-3 is-flex is-flex-direction-column is-justify-content-space-between">
                  <p className="is-size-8 has-text-grey has-text-weight-semibold mb-5">
                    TOTAL SUMMARIES
                  </p>
                  <p className="is-flex is-flex-wrap-wrap pb-3">
                    {renderTopReactions()}
                  </p>
                </div>
                <div className="column is-3 is-flex is-flex-direction-column is-justify-content-space-between">
                  <p className="is-size-8 has-text-grey has-text-weight-semibold mb-5">
                    COMMON TAGS
                  </p>
                  <p>
                    {renderTopTags()}
                  </p>
                </div>
                <div className="column is-2 is-flex is-flex-direction-column is-justify-content-space-between">
                {isActive && <div className="is-flex pt-15">
            <button className={clsx("button border-radius-0 is-small", commentView === 'received' ? 'is-primary' : '')} onClick={() => setCommentView('received')}>
              Comments received
            </button>
            <button className={clsx("button border-radius-0 is-small", commentView === 'given' ? 'is-primary' : '')} onClick={() => setCommentView('given')}>
              Comments given
            </button>
            </div>}
                </div>
              </div>
        </div>
        <div className="is-divider is-hidden-mobile m-0 p-0 has-background-gray-400"/>
        <TeamStatsFilter filter={filter} individualFilter={isActive} commentView={commentView} filterRepoList={filterRepoList} filterUserList={filterUserList} filterRequesterList={filterRequesterList} filterPRList={filterPRList} handleFilter={handleFilter} />
        <div className="is-flex is-flex-wrap-wrap my-20">
          <ReactionLineChart reactions={reactionChartData} groupBy={dateData.groupBy} onClick={() => setOpenReactionsModal(true)} />
          <TagsChart isTeamView className="mr-neg10" tags={tagsChartData} groupBy={dateData.groupBy} onClick={() => setOpenTagsModal(true)} />
        </div>
        {openReactionsModal && <SnapshotModal dataType={SNAPSHOT_DATA_TYPES.SUMMARIES_AREA} active={openReactionsModal} onClose={()=>setOpenReactionsModal(false)} snapshotData={{ componentData }}/>}
        {openTagsModal && <SnapshotModal dataType={SNAPSHOT_DATA_TYPES.TAGS} active={openTagsModal} onClose={()=>setOpenTagsModal(false)} snapshotData={{ componentData }}/>}
        {openCommentsModal && <SnapshotModal dataType={SNAPSHOT_DATA_TYPES.ACTIVITY} active={openCommentsModal} onClose={()=> setOpenCommentsModal(false)} snapshotData={{ componentData }}/>}
        <div className="is-flex is-align-items-center mb-20">
          <p className="has-text-black-950 has-text-weight-semibold is-size-4 px-15">Comments {commentView}</p>
          <div>
            <SnapshotButton onClick={() => setOpenCommentsModal(true)} />
          </div>
        </div>
        <ActivityItemList comments={filteredComments} />
      </div>
    </div>)
}

export default withLayout(TeamInsights);
