import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { find, flatten, size, uniqBy } from 'lodash';
import CardList from '../../components/comment/cardList';
import withLayout from '../../components/layout';
import Helmet, { CommentCollectionsHelmet } from '../../components/utils/Helmet';
import { engGuidesOperations } from '../../state/features/engGuides';

const NUM_PER_PAGE = 9;

const { getEngGuides } = engGuidesOperations;

const EngineeringGuides = () => {
  const dispatch = useDispatch();
  const { auth, engGuidesState } = useSelector((state) => ({
    auth: state.authState,
    engGuidesState: state.engGuidesState,
  }));
  const { token } = auth;
  const { engGuides } = engGuidesState;

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getEngGuides(token));
  }, [dispatch, token]);

  const viewMore = () => {
    setPage(page + 1);
  };

  return (
    <div className="has-background-gray-9 hero">
      <Helmet {...CommentCollectionsHelmet} />
      <div className="hero-body">
        <div className="is-flex is-justify-content-space-between is-flex-wrap-wrap p-10">
          <p className="has-text-weight-semibold has-text-deep-black is-size-3">
            Community Engineering Guides
          </p>
        </div>
        <p className="is-size-6 has-text-deep-black px-10 mb-40">
          Explore detail of best practise coding techniques from world recongized experts.
        </p>
        <CardList collections={engGuides?.slice(0, NUM_PER_PAGE * page) || []} />
        <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center is-fullwidth my-50">
          {engGuides.length > NUM_PER_PAGE && NUM_PER_PAGE * page < engGuides.length && (
            <button onClick={viewMore} className="button has-background-gray-9 is-primary is-outlined has-text-weight-semibold is-size-6" type="button">
              View More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default withLayout(EngineeringGuides);
