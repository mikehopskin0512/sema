import React from 'react';
import PropTypes from 'prop-types';
import CollectionCard from '../collectionCard';

const CardList = ({ collections }) => (
  collections.length && collections.length > 0 ? (
    <div className="is-flex is-justify-content-flex-start is-flex-wrap-wrap">
      {collections.map((item) => (<CollectionCard {...item} key={`${item.collectionData._id}-collection`} />))}
    </div>
  ) :
    <p className="px-10 py-20 mb-50">No collections!</p>
);

CardList.propTypes = {
  collections: PropTypes.array.isRequired,
};

export default CardList;
