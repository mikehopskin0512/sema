import React from 'react'
import PropTypes from 'prop-types'
import ActivityItem from '../item'

const ActivityItemList = ({ comments }) => {
  return (
    <>
      {
        comments.length ? comments.map((comment) => {
          return (
            <div className="my-10" key={`activity-${comment._id}`} >
              <ActivityItem {...comment} />
            </div>
          )
        }) : (
          <div className="my-10 p-20 has-background-white">
            <p>No activity found!</p>
          </div>
        )
      }
    </>
  )
}

ActivityItemList.defaultProps = {
  comments: []
};

ActivityItemList.propTypes = {
  comments: PropTypes.array
};

export default ActivityItemList;
