import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import clsx from 'clsx'
import { find, } from 'lodash';
import { format } from 'date-fns';
import Helmet, { PersonalInsightsHelmet } from '../../components/utils/Helmet';
import withLayout from '../../components/layout';
import PersonalStatsTile from '../../components/personalInsights/personalStatsTile';
import StatsFilter from '../../components/statsFilter';
import ReactionChart from '../../components/stats/reactionChart';
import TagsChart from '../../components/stats/tagsChart';
import ActivityItemList from '../../components/activity/itemList';
import DateRangeSelector from '../../components/dateRangeSelector';
import { repositoriesOperations } from "../../state/features/repositories";
import { commentsOperations } from "../../state/features/comments";
import { EMOJIS, TAGS } from '../../utils/constants';

const { getUserComments, getUserReceivedComments, fetchSmartCommentSummary } = commentsOperations;
const { fetchRepositoryOverview, getUserRepositories } = repositoriesOperations;

const PersonalInsights = () => {
  const dispatch = useDispatch();
  const { auth, repositories, comments } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState,
    comments: state.commentsState
  }));
  const { token, user } = auth;
  const githubUser = user.identities?.[0];

  const [totalSmartComments, setTotalSmartComments] = useState(0);
  const [topTags, setTopTags] = useState([])
  const [topReactions, setTopReactions] = useState([])
  const [filter, setFilter] = useState({
    from: '',
    to: '',
    reactions: '',
    tags: '',
    search: '',
    pr: '',
  });
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [commentView, setCommentView] = useState('received')
  const [filterUserList, setFilterUserList] = useState([]);
  const [filterRequesterList, setFilterRequesterList] = useState([]);
  const [filterPRList, setFilterPRList] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);

  const getUserRepos = async (repositories) => {
    await dispatch(getUserRepositories(repositories, token));
  };

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

  const getTopReactions = async (reactions) => {
    let data = [];
    if (reactions) {
      const sorted = Object.keys(reactions).sort(function(a,b){return reactions[b]-reactions[a]})
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
      const sorted = Object.keys(tags).sort(function(a,b){return tags[b]-tags[a]})
      data = await Promise.all(sorted.filter((_, index) => index <= 2).map(async (tag) => {
        const label = await getTagLabel(tag)
        return {
          [label]: tags[tag]
        }
      }));
    }
    setTopTags(data);
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
    getUserRepos(githubUser?.repositories);
    // fetchUserComments(auth.user);
    fetchUserReceivedComments(githubUser?.username)
    getUserSummary(githubUser?.username)
  }, [auth]);

  useEffect(() => {
    console.log(repositories)
  }, [repositories])

  useEffect(() => {
    getTopReactions(comments.summary.reactions);
    getTopTags(comments.summary.tags);
    setTotalSmartComments(comments.summary?.smartComments?.length)
  }, [comments])
  
  // useEffect(() => {
  //   if (overview && overview.smartcomments) {
  //     let filtered = overview.smartcomments || [];
  //     if (
  //       !isEmpty(filter.from) ||
  //       !isEmpty(filter.to) ||
  //       !isEmpty(filter.reactions) ||
  //       !isEmpty(filter.tags) ||
  //       !isEmpty(filter.search) ||
  //       !isEmpty(filter.pr)
  //     ) {
  //       filtered = overview.smartcomments.filter((item) => {
  //         const fromIndex = item?.userId ? findIndex(filter.from, { value: item.userId._id }) : -1;
  //         const toIndex = item?.githubMetadata ? findIndex(filter.to, { value: item?.githubMetadata?.requester }) : -1;
  //         const prIndex = item?.githubMetadata ? findIndex(filter.pr, { value: item?.githubMetadata?.pull_number }) : -1;
  //         const reactionIndex = findIndex(filter.reactions, { value: item?.reaction });
  //         const tagsIndex = item?.tags ? filterByTags(item.tags) : false;
  //         const searchBool = item?.comment?.toLowerCase().includes(filter.search.toLowerCase());
  //         let filterBool = true;
  //         if (!isEmpty(filter.from)) {
  //           filterBool = filterBool && fromIndex !== -1;
  //         }
  //         if (!isEmpty(filter.to)) {
  //           filterBool = filterBool && toIndex !== -1;
  //         }
  //         if (!isEmpty(filter.reactions)) {
  //           filterBool = filterBool && reactionIndex !== -1;
  //         }
  //         if (!isEmpty(filter.tags)) {
  //           filterBool = filterBool && tagsIndex;
  //         }
  //         if (!isEmpty(filter.search)) {
  //           filterBool = filterBool && searchBool;
  //         }
  //         if (!isEmpty(filter.pr)) {
  //           filterBool = filterBool && prIndex !== -1;
  //         }
  //         return filterBool;
  //       });
  //     }
  //     setFilteredComments(filtered);
  //   }
  // }, [overview, filter]);

  return (
    <>
    <div className='has-background-gray-9 pb-300'>
      <Helmet {...PersonalInsightsHelmet} />
      <div className="py-30 px-80 is-hidden-mobile">
        <div className="mb-15">
          <div className="is-flex is-justify-content-space-between">
            <p className="has-text-deep-black has-text-weight-semibold is-size-4 mb-20 px-15">Personal Insights</p>
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
        <StatsFilter filterUserList={filterUserList} filterRequesterList={filterRequesterList} filterPRList={filterPRList} />
        <div className="is-flex is-flex-wrap-wrap my-20">
          <ReactionChart  className="ml-neg10"  />
          <TagsChart  className="mr-neg10" />
        </div>
        <p className="has-text-deep-black has-text-weight-semibold is-size-4 mb-20 px-15">Comments {commentView}</p>
        <ActivityItemList />
      </div>
    </div>
    </>
  )
}

export default withLayout(PersonalInsights);