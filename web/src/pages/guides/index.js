import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import CardList from '../../components/comment/cardList';
import EngGuidesCollection from '../../components/engGuides/engGuidesCollection';
import withLayout from '../../components/layout';
import Helmet, { SnippetCollectionsHelmet } from '../../components/utils/Helmet';
import { engGuidesOperations } from '../../state/features/engGuides';
import GlobalSearch from "../../components/globalSearch";
import Loader from '../../components/Loader';
import useAuthEffect from '../../hooks/useAuthEffect';

const NUM_PER_PAGE = 9;

const { getEngGuides } = engGuidesOperations;

const EngineeringGuides = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { auth, engGuidesState } = useSelector((state) => ({
    auth: state.authState,
    engGuidesState: state.engGuidesState,
  }));
  const { token } = auth;
  const { engGuides = [] } = engGuidesState;
  const { query: { cid: collectionId } } = router;
  const [page, setPage] = useState(1);

  useAuthEffect(() => {
    dispatch(getEngGuides());
  }, []);

  const viewMore = () => {
    setPage(page + 1);
  };

  const renderCollections = () => {
    if (auth.isFetching || engGuidesState.isFetching) {
      return(
        <div className="is-flex is-align-items-center is-justify-content-center" style={{ height: '55vh' }}>
          <Loader/>
        </div>
      )
    }
    return (
      <div className="my-40">
        <Helmet {...SnippetCollectionsHelmet} />
        <div>
          <div className="is-flex is-justify-content-space-between is-flex-wrap-wrap p-10">
            <p className="has-text-weight-semibold has-text-black-950 is-size-3">
              Community Engineering Guides
            </p>
            <GlobalSearch/>
          </div>
          <p className="is-size-6 has-text-black-950 px-10 mb-40">
            Explore detail of best practise coding techniques from world recongized experts.
          </p>
          <CardList collections={engGuides?.slice(0, NUM_PER_PAGE * page) || []} />
          <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center is-fullwidth my-50">
            {engGuides?.length > NUM_PER_PAGE && NUM_PER_PAGE * page < engGuides?.length && (
              <button onClick={viewMore} className="button has-background-gray-200 is-primary is-outlined has-text-weight-semibold is-size-6 has-text-primary" type="button">
                View More
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderGuides = () => {
    if (collectionId) {
      return <EngGuidesCollection collectionId={collectionId} />
    }
    return renderCollections();
  }

  return renderGuides();
};

export default withLayout(EngineeringGuides);
