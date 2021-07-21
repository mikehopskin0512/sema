import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import CardList from '../../components/comment/cardList';
import withLayout from '../../components/layout';
import Helmet, { SuggestedCommentsHelmet } from '../../components/utils/Helmet';

const CommentCollections = () => (
  <div className="has-background-gray-9 hero">
    <Helmet {...SuggestedCommentsHelmet} />
    <div className="hero-body">
      <div className="is-flex is-justify-content-space-between is-flex-wrap-wrap p-10">
        <p className="has-text-weight-semibold has-text-deep-black is-size-4">Active Comment Collections</p>
        <form>
          <div className="control has-icons-left has-icons-right">
            <input className="input is-small has-background-white" type="search" placeholder="Search" />
            <span className="icon is-small is-left">
              <FontAwesomeIcon icon={faSearch} />
            </span>
          </div>
        </form>
      </div>
      <p className="is-size-6 has-text-deep-black my-10 px-10">
        These are the Comments that will be suggested as you create code reviews. Turn off to move them to other collections.
      </p>
      <CardList />
      <p className="has-text-weight-semibold has-text-deep-black is-size-4 mt-60 p-10">Other Comment Collections</p>
      <CardList />
      <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center is-fullwidth my-50">
        <button className="button has-background-gray-9 is-primary is-outlined has-text-weight-semibold is-size-6" type="button">
          View More
        </button>
      </div>
    </div>
  </div>
);

export default withLayout(CommentCollections);
