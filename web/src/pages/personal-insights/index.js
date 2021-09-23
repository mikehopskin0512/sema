import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import clsx from 'clsx'
import { find, findIndex, isEmpty, uniqBy } from 'lodash';
import { differenceInCalendarDays } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Helmet, { PersonalInsightsHelmet } from '../../components/utils/Helmet';
import withLayout from '../../components/layout';
import PersonalStatsTile from '../../components/personalInsights/personalStatsTile';
import StatsFilter from '../../components/statsFilter';
import ReactionChart from '../../components/stats/reactionChart';
import TagsChart from '../../components/stats/tagsChart';
import ActivityItemList from '../../components/activity/itemList';
import { commentsOperations } from "../../state/features/comments";
import { DAYS_IN_MONTH, DAYS_IN_WEEK, DAYS_IN_YEAR, EMOJIS, TAGS, DEFAULT_AVATAR } from '../../utils/constants';
import { generateDays, generateMonths, generateWeeks, generateYears } from '../../components/stats/codeStatsServices';

const { getUserComments, getUserReceivedComments, fetchSmartCommentSummary, fetchSmartCommentOverview } = commentsOperations;


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

  const fetchUserComments = async (username) => {
    await dispatch(getUserComments(username, token))
  };

  const fetchUserReceivedComments = async (username) => {
    await dispatch(getUserReceivedComments(username, token))
  }

  const getUserSummary = async (username) => {
    const params = {
      author: username,
    };
    dispatch(fetchSmartCommentSummary(params, token))
  };

  const getCommentsOverview = async (filter) => {
    const { username } = githubUser;
    const { startDate, endDate, search } = filter;
    const params = {
      startDate,
      endDate
    }
    if (commentView === 'given') {
      params.author = username
    } else {
      params.requester = username
    }
    dispatch(fetchSmartCommentOverview(params, token))
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
        const label = await getTagLabel(tag)
        return {
          [label]: tags[tag]
        }
      }));
    }
    setTopTags(data);
  };

  const filterByTags = (tags) => {
    const filterCount = filter.tags.length;
    let matches = 0;
    tags.forEach((tag) => {
      const tagIndex = findIndex(filter.tags, { value: tag._id });
      if (tagIndex > -1) {
        matches += 1;
      }
    });
    return matches === filterCount;
  };

  const parseTagsData = (tags) => {
    if (tags) {
      let tagsObject = {};
      for (const [key, val] of Object.entries(tags)) {
        tagsObject[key] = {
          total: val
        };
      }
      setTagsChartData(tagsObject)
    }
  }

  const parseReactionsData = (smartcomments = []) => {
    if (smartcomments.length > 0) {
      const { startDate, endDate } = filter;
      let start = smartcomments[smartcomments.length - 1]?.createdAt || subDays(new Date(), 6);
      let end = new Date();
      if (startDate && endDate) {
        start = startDate;
        end = endDate;
      }
      const diff = differenceInCalendarDays(new Date(end), new Date(start));
      if (diff < DAYS_IN_WEEK + 1) {
        const reactionsArr = generateDays(smartcomments, diff, end);
        setReactionChartData(reactionsArr);
      }

      if (diff < DAYS_IN_MONTH && diff >= DAYS_IN_WEEK) {
        const reactionsArr = generateWeeks(smartcomments, start, end);
        setReactionChartData(reactionsArr);
      }

      if (diff < DAYS_IN_YEAR && diff >= DAYS_IN_MONTH) {
        const reactionsArr = generateMonths(smartcomments, start, end);
        setReactionChartData(reactionsArr);
      }

      if (diff >= DAYS_IN_YEAR) {
        const reactionsArr = generateYears(smartcomments, start, end);
        setReactionChartData(reactionsArr);
      }
    }
  }

  const handleFilter = (value) => {
    setFilter(value)
  };

  const getEmoji = (id) => {
    const { emoji } = find(EMOJIS, { _id: id });
    return emoji;
  };

  const getTagLabel = async (id) => {
    const { label } = find(TAGS, { _id: id });
    return label;
  };

  useEffect(() => {
    // getUserRepos(githubUser?.repositories);
    fetchUserReceivedComments(githubUser?.username)
    getUserSummary(githubUser?.username)
  }, [auth]);

  useEffect(() => {
    const { summary, overview } = comments;
    getTopReactions(summary.reactions);
    getTopTags(summary.tags);
    setTotalSmartComments(summary?.smartComments?.length)
    parseTagsData(overview?.tags)
    parseReactionsData(overview?.smartComments)
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
      let filtered = overview.smartComments || [];
      if (
        !isEmpty(filter.from) ||
        !isEmpty(filter.to) ||
        !isEmpty(filter.reactions) ||
        !isEmpty(filter.tags) ||
        !isEmpty(filter.search) ||
        !isEmpty(filter.pr)
      ) {
        filtered = overview.smartComments.filter((item) => {
          const fromIndex = item?.userId ? findIndex(filter.from, { value: item.userId._id }) : -1;
          const toIndex = item?.githubMetadata ? findIndex(filter.to, { value: item?.githubMetadata?.requester }) : -1;
          const prIndex = item?.githubMetadata ? findIndex(filter.pr, { value: item?.githubMetadata?.pull_number }) : -1;
          const reactionIndex = findIndex(filter.reactions, { value: item?.reaction });
          const tagsIndex = item?.tags ? filterByTags(item.tags) : false;
          const searchBool = item?.comment?.toLowerCase().includes(filter.search.toLowerCase());
          let filterBool = true;
          if (!isEmpty(filter.from)) {
            filterBool = filterBool && fromIndex !== -1;
          }
          if (!isEmpty(filter.to)) {
            filterBool = filterBool && toIndex !== -1;
          }
          if (!isEmpty(filter.reactions)) {
            filterBool = filterBool && reactionIndex !== -1;
          }
          if (!isEmpty(filter.tags)) {
            filterBool = filterBool && tagsIndex;
          }
          if (!isEmpty(filter.search)) {
            filterBool = filterBool && searchBool;
          }
          if (!isEmpty(filter.pr)) {
            filterBool = filterBool && prIndex !== -1;
          }
          return filterBool;
        });
      }
      setFilteredComments(filtered);
    }
  };

  useEffect(() => {
    const { overview } = comments;
    filterComments(overview);
    setFilterValues(overview);
  }, [comments, filter]);

  return (
    <>
      <div className='has-background-gray-9 pb-300'>
        <Helmet {...PersonalInsightsHelmet} />
        <div className="py-30 px-80 is-hidden-mobile">
          <div className="mb-15">
            <div className="is-flex is-justify-content-space-between">
              <p className="has-text-deep-black has-text-weight-semibold is-size-4 mb-20 px-15">
                Personal Insights
                <span className="ml-20 is-size-7 has-text-weight-normal">
                  <FontAwesomeIcon icon={faInfoCircle} color="#2D74BA" className="mx-10" />
                  Only you can see this page.
                  <a href="https://semasoftware.com/blog/introducing-release-1-0-9a67cf38a841">
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
            <ReactionChart className="ml-neg10" reactions={reactionChartData} yAxisType='total' />
            <TagsChart className="mr-neg10" tags={tagsChartData} />
          </div>
          <p className="has-text-deep-black has-text-weight-semibold is-size-4 mb-20 px-15">Comments {commentView}</p>
          <ActivityItemList comments={filteredComments} />
        </div>
      </div>
    </>
  )
}

export default withLayout(PersonalInsights);