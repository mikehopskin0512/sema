import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import styles from './comments.module.scss';
import CommentsViewButtons from '../../components/comment/commentsViewButtons';
import SuggestedCommentCard from '../../components/comment/suggestedCommentCard';
import ContactUs from '../../components/contactUs';
import withLayout from '../../components/layout';
import SupportForm from '../../components/supportForm';
import Helmet, { SuggestedCommentsHelmet } from '../../components/utils/Helmet';

const SuggestedComments = () => {
  const { auth } = useSelector((state) => ({
    auth: state.authState,
  }));

  const [supportForm, setSupportForm] = useState(false);
  const { userVoiceToken } = auth;

  const openSupportForm = () => setSupportForm(true);
  const closeSupportForm = () => setSupportForm(false);

  return (
    <div className="has-background-gray-9 hero">
      <Helmet {...SuggestedCommentsHelmet} />
      <SupportForm active={supportForm} closeForm={closeSupportForm} />
      <div className="hero-body">
        <div className="is-flex is-justify-content-space-between is-flex-wrap-wrap p-10">
          <p className="has-text-weight-semibold has-text-deep-black is-size-4">
            Suggested Comments
          </p>
          <CommentsViewButtons />
        </div>
        <div className={clsx('has-background-white border-radius-4px px-10 py-5 is-flex is-flex-wrap-wrap', styles['filter-container'])}>
          <div className="is-flex-grow-5 p-5">
            <div className="control has-icons-left has-icons-right">
              <input className="input has-background-white is-small" placeholder="Search suggested comments" type="text" />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faSearch} />
              </span>
            </div>
          </div>
          <div className="is-flex-grow-1 is-flex">
            <div className="is-flex-grow-1 p-5">
              <div className="select is-fullwidth is-small">
                <select className="has-background-white">
                  <option>Tags</option>
                  <option>With options</option>
                </select>
              </div>
            </div>
            <div className="is-flex-grow-1 p-5">
              <div className="select is-fullwidth is-small">
                <select className="has-background-white">
                  <option>Tags</option>
                  <option>With options</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <SuggestedCommentCard />
        <SuggestedCommentCard />
        <SuggestedCommentCard />
        <SuggestedCommentCard />
        <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center is-fullwidth mt-50 mb-30">
          <button className="button has-background-gray-9 is-outlined has-text-weight-semibold is-size-6 is-primary" type="button">View More</button>
        </div>
      </div>
      <ContactUs userVoiceToken={userVoiceToken} openSupportForm={openSupportForm} />
    </div>
  );
};

export default withLayout(SuggestedComments);
