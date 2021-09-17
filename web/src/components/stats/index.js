import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { format, subDays, differenceInCalendarDays } from 'date-fns';
import { generateDays, generateWeeks, generateMonths, generateYears } from './codeStatsServices';
import ReactionChart from './reactionChart';
import TagsChart from './tagsChart';

import DateRangeSelector from '../dateRangeSelector';
import { TagList } from '../../data/activity';

const dayInWeek = 7;
const dayInMonth = 30;
const dayInYear = 365;

const StatsPage = ({ startDate, endDate, setStartDate, setEndDate }) => {
  const { repositories } = useSelector((state) => ({
    repositories: state.repositoriesState,
  }));

  const { data: { overview } } = repositories;

  const [reactions, setReactions] = useState([]);
  const [tags, setTags] = useState({});

  const getReactionOverview = (smartcomments) => {
    if (smartcomments.length > 0) {
      let start = smartcomments[smartcomments.length - 1]?.createdAt || subDays(new Date(), 6);
      let end = new Date();
      if (startDate && endDate) {
        start = startDate;
        end = endDate;
      }
      const diff = differenceInCalendarDays(new Date(end), new Date(start));
      if (diff < dayInWeek + 1) {
        const reactionsArr = generateDays(smartcomments, diff, end);
        setReactions(reactionsArr);
      }

      if (diff < dayInMonth && diff >= dayInWeek) {
        const reactionsArr = generateWeeks(smartcomments, start, end);
        setReactions(reactionsArr);
      }

      if (diff < dayInYear && diff >= dayInMonth) {
        const reactionsArr = generateMonths(smartcomments, start, end);
        setReactions(reactionsArr);
      }

      if (diff >= dayInYear) {
        const reactionsArr = generateYears(smartcomments, start, end);
        setReactions(reactionsArr);
      } 
    }
  }

  const getTagsOverview = (smartcomments) => {
    let tagObject = {};
    // Set TagId as object keys
    TagList.forEach((tag) => {
      tagObject[tag.value] = {
        total: 0
      };
    });
    // Add count to matching smart comment tag
    smartcomments.forEach((comment) => {
      comment.tags.forEach((tag) => {
        tagObject[tag._id].total += 1;
      })
    });
    setTags(tagObject)
  }

  useEffect(() => {
    if (overview?.smartcomments) {
      getReactionOverview(overview?.smartcomments);
      getTagsOverview(overview?.smartcomments);
    }
  }, [repositories]);

  return(
    <>
      <div className="is-flex is-justify-content-space-between is-flex-wrap-wrap px-10">
        <p className="has-text-deep-black has-text-weight-semibold is-size-4">Repo Stats</p>
        <div>
          <DateRangeSelector
            start={startDate}
            end={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            isRight
            buttonProps={{
              placeholder: 'Select Dates',
            }}
          />
        </div>
      </div>
      {startDate && endDate && (
        <p className="px-10 mt-10 has-text-primary">Showing data from <b>{format(new Date(startDate), 'MMMM dd, yyyy')}</b> to <b>{format(new Date(endDate), 'MMMM dd, yyyy')}</b></p>
      )}
      <div className="is-flex is-flex-wrap-wrap mt-10">
        <ReactionChart reactions={reactions} />
        <TagsChart tags={tags} />
      </div>
    </>
  );
};

export default StatsPage;
