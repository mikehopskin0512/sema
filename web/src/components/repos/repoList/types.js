/* eslint-disable import/prefer-default-export */
import PropTypes from 'prop-types';

// WILL CHANGE UPON INTEGRATION
export const RepoType = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  stats: PropTypes.exact({
    codeReview: PropTypes.number.isRequired,
    comments: PropTypes.number.isRequired,
    commenters: PropTypes.number.isRequired,
    semaUsers: PropTypes.number.isRequired,
  }),
  users: PropTypes.arrayOf(PropTypes.exact({
    imgUrl: PropTypes.string.isRequired,
  })),
};
