import React, { useState } from 'react'
import clsx from 'clsx'
import { format } from 'date-fns';
import Helmet, { PersonalInsightsHelmet } from '../../components/utils/Helmet';
import withLayout from '../../components/layout';
import PersonalStatsTile from '../../components/personalInsights/personalStatsTile';
import StatsFilter from '../../components/statsFilter';
import ReactionChart from '../../components/stats/reactionChart';
import TagsChart from '../../components/stats/tagsChart';
import ActivityItemList from '../../components/activity/itemList';
import DateRangeSelector from '../../components/dataRangeSelector';

const PersonalInsights = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [commentView, setCommentView] = useState('received')
  const [filterUserList, setFilterUserList] = useState([]);
  const [filterRequesterList, setFilterRequesterList] = useState([]);
  const [filterPRList, setFilterPRList] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);

  return (
    <>
    <div className='has-background-gray-9 pb-300'>
      <Helmet {...PersonalInsightsHelmet} />
      <div className="py-30 px-80 is-hidden-mobile">
        <div className="mb-15">
          <div className="is-flex is-justify-content-space-between">
            <p className="has-text-deep-black has-text-weight-semibold is-size-4 mb-20 px-15">Personal Insights</p>
            <DateRangeSelector
            start={startDate}
            end={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
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
        <PersonalStatsTile />
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