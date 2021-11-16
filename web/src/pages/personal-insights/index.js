import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import clsx from 'clsx'
import { findIndex, isEmpty, uniqBy } from 'lodash';
import { InfoFilledIcon } from '../../components/Icons';
import { isWithinInterval } from 'date-fns';
import Helmet, { PersonalInsightsHelmet } from '../../components/utils/Helmet';
import withLayout from '../../components/layout';
import PersonalStatsTile from '../../components/personalInsights/personalStatsTile';
import StatsFilter from '../../components/statsFilter';
import ReactionChart from '../../components/stats/reactionChart';
import TagsChart from '../../components/stats/tagsChart';
import ActivityItemList from '../../components/activity/itemList';
import { commentsOperations } from "../../state/features/comments";
import { DEFAULT_AVATAR, SEMA_FAQ_URL } from '../../utils/constants';
import { getEmoji, getTagLabel, setSmartCommentsDateRange, getReactionTagsChartData, filterSmartComments, getDateSub } from '../../utils/parsing';
import useAuthEffect from '../../hooks/useAuthEffect';

const { fetchSmartCommentSummary, fetchSmartCommentOverview } = commentsOperations;

const PersonalInsights = () => {
  const dispatch = useDispatch();
  const { auth, comments } = useSelector((state) => ({
    auth: state.authState,
    comments: state.commentsState
  }));
  const { token, user } = auth;
  const githubUser = user.identities?.[0];

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
  });
  const [commentView, setCommentView] = useState('received')
  const [filterUserList, setFilterUserList] = useState([]);
  const [filterRequesterList, setFilterRequesterList] = useState([]);
  const [filterPRList, setFilterPRList] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [outOfRangeComments, setOutOfRangeComments] = useState([]);
  const [dateData, setDateData] = useState({
    groupBy: '',
    startDate: null,
    endDate: null,
    dateDiff: 0,
  });

  const getUserSummary = async (username) => {
    const params = {
      user: username,
    };//this
    dispatch(fetchSmartCommentSummary(params, token))
  };

  const getCommentsOverview = async (filter) => {
    const { username } = githubUser;
    const { startDate, endDate, search } = filter;
    const params = startDate && endDate ? getDateSub(startDate, endDate) : {}
    if (commentView === 'given') {
      params.reviewer = username
    } else {
      params.requester = username
    }
    if ((startDate && endDate) || (!startDate && !endDate)) {
      dispatch(fetchSmartCommentOverview(params, token));
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
    const { overview } = comments;
    const { startDate, endDate } = filter;
    if (overview?.smartComments && overview?.smartComments.length > 0) {
      const dates = setSmartCommentsDateRange(overview.smartComments, startDate, endDate);
      const { startDay, endDay, dateDiff, groupBy } = dates;
      setDateData({
        dateDiff,
        groupBy,
        startDate: new Date(startDay),
        endDate: endDay
      })
    }
  }, [comments, filter]);

  useEffect(() => {
    const { startDate, endDate, groupBy } = dateData;
    if (startDate && endDate && groupBy) {
      const { reactionsChartData, tagsChartData } = getReactionTagsChartData({
        ...dateData,
        smartComments: [...filteredComments, ...outOfRangeComments],
      });
      setReactionChartData(reactionsChartData);
      setTagsChartData(tagsChartData);
    }
  }, [dateData, filteredComments]);

  useAuthEffect(() => {
    getUserSummary(githubUser?.username)
  }, [auth]);

  useEffect(() => {
    const { summary, overview } = comments;
    getTopReactions(summary.reactions);
    getTopTags(summary.tags);
    setTotalSmartComments(summary?.smartComments?.length)
  }, [comments])

  useEffect(() => {
    getCommentsOverview(filter);
  }, [filter, commentView]);

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
      const { startDate, endDate } = dateData;
      const filtered = filterSmartComments({ filter, smartComments: overview.smartComments, startDate, endDate });
      const outOfRangeCommentsFilter = overview.smartComments.filter((comment) => !isWithinInterval(new Date(comment.createdAt), {
        start: new Date(startDate),
        end: new Date(endDate)
      }));
      setFilteredComments(filtered);
      setOutOfRangeComments(outOfRangeCommentsFilter);
    }
  };

  useEffect(() => {
    const { overview } = comments;
    filterComments(overview);
    setFilterValues(overview);
  }, [comments, filter]);

  return (
    <>
      <Helmet {...PersonalInsightsHelmet} />
      <div className="my-40 is-hidden-mobile">
        <div className="mb-15">
          <div className="is-flex is-justify-content-space-between">
            <p className="has-text-deep-black has-text-weight-semibold is-size-4 mb-20 px-15">
              Personal Insights
              <span className="ml-20 is-size-7 has-text-weight-normal">
                <InfoFilledIcon
                  color="#2D74BA"
                  size="small"
                  style={{ verticalAlign: 'text-bottom' }}
                />
                <span className="ml-8">
                  Only you can see this page.
                </span>
                <a href={SEMA_FAQ_URL}>
                  <span className="is-underlined ml-5">
                    Learn More
                  </span>
                </a>
              </span>
            </p>

            <div className="is-flex">
              <button className={clsx("button border-radius-0 is-small", commentView === 'received' ? 'is-primary' : '')} onClick={() => setCommentView('received')}>
                Comments received
              </button>
              <button className={clsx("button border-radius-0 is-small", commentView === 'given' ? 'is-primary' : '')} onClick={() => setCommentView('given')}>
                Comments given
              </button>
            </div>
          </div>
        </div>
        <PersonalStatsTile topTags={topTags} topReactions={topReactions} totalSmartComments={totalSmartComments} />
        <StatsFilter filterUserList={filterUserList} filterRequesterList={filterRequesterList} filterPRList={filterPRList} handleFilter={handleFilter} />
        <div className="is-flex is-flex-wrap-wrap my-20">
          <ReactionChart className="ml-neg10" reactions={reactionChartData} yAxisType='total' groupBy={dateData.groupBy} />
          <TagsChart className="mr-neg10" tags={tagsChartData} groupBy={dateData.groupBy} />
        </div>
        <p className="has-text-deep-black has-text-weight-semibold is-size-4 mb-20 px-15">Comments {commentView}</p>
        <ActivityItemList comments={filteredComments} />
      </div>
    </>
  )
}

export default withLayout(PersonalInsights);
