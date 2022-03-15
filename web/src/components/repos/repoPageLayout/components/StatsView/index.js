import React, { useMemo } from 'react';
import StatCard from '../StatCard';
import { isWithinInterval } from "date-fns";
import { uniqBy } from "lodash";
import {
  endOfDay,
  startOfDay,
} from 'date-fns';

const StatsView = ({ overview, dates }) => {
  const { smartcomments = [], users = [] } = overview;

  const reposStats = useMemo(() => {
    const smartComments = smartcomments.filter((item) => dates.startDate && dates.endDate ? isWithinInterval(new Date(item.createdAt), {
      start: startOfDay(new Date(dates.startDate)),
      end: endOfDay(new Date(dates.endDate))
    }) : true);
    const totalSmartComments = smartComments.length || 0;
    const totalSmartCommenters = uniqBy(smartComments, (item) => item.userId?._id?.valueOf() || 0).length || 0;
    const totalPullRequests = uniqBy(smartComments, 'githubMetadata.pull_number').length || 0;
    const totalSemaUsers = users?.length || 0;
    return [
      { title: 'smart code reviews', value: totalPullRequests, tooltip: 'Smart code review is a pull request that is reviewed uses Sema product'},
      { title: 'smart comments', value: totalSmartComments, tooltip: 'Smart Comment is a part of Smart Code Review'},
      { title: 'smart commenters', value: totalSmartCommenters, tooltip: 'Smart commenter is a reviewer that uses Sema'},
      { title: 'sema users', value: totalSemaUsers, tooltip: 'Sema user is a code reviewer who uses Sema, or a code author that has a Sema account'},
    ]
  }, [overview]);

  return (
    <div className="columns m-0 mb-20">
      {reposStats.map(({ title, value, tooltip }) => (
        <StatCard
          title={title}
          value={value}
          tooltip={tooltip}
        />
      ))}
    </div>
  );
}

export default StatsView;
