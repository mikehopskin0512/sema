import React from 'react';
import PropTypes from 'prop-types';
import Card from '../card';

const CardList = ({ collections, addNewComment }) => (
  collections.length && collections.length > 0 ? (
    <div className="is-flex is-justify-content-flex-start is-flex-wrap-wrap">
      {collections.map((item) => (<Card {...item} key={`${item.collectionData._id}-collection`} addNewComment={addNewComment} />))}
    </div>
  ) :
    <p className="px-10 py-20 mb-50">No collections!</p>
);

CardList.defaultProps = {
  collections: [],
  engGuides: [],
  addNewComment: null,
};

CardList.propTypes = {
  collections: PropTypes.array,
  engGuides: PropTypes.array,
  addNewComment: PropTypes.func,
};

export default CardList;
