import React from 'react';
import CollectionCard from '../collectionCard';

const CardList = () => (
  <div className="is-flex is-justify-content-flex-start is-flex-wrap-wrap">
    <CollectionCard name="Card Name 1" />
    <CollectionCard name="Card Name 2" />
    <CollectionCard name="Card Name 3" />
    <CollectionCard name="Card Name 4" />
    <CollectionCard name="Card Name 5" />
  </div>
);

export default CardList;
