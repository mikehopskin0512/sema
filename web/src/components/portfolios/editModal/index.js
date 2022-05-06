import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { InputField } from 'adonis';
import { useDispatch } from 'react-redux';
import { updatePortfolioOverview } from '../../../state/features/portfolios/actions';
import Toaster from '../../toaster';
import styles from './editModal.module.scss';
import { SEMA_FAQ_SLUGS, SEMA_FAQ_URL } from '../../../utils/constants';
import { EditorState, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import dynamic from 'next/dynamic';
import { gray400 } from '../../../../styles/_colors.module.scss';

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
);

const EditPortfolio = ({ isModalActive, toggleModalActive, profileOverview, portfolioId }) => {
  const [overview, setOverview] = useState(!profileOverview ? EditorState.createEmpty() :
    profileOverview[0] !== '{' ?
      EditorState.createWithContent(ContentState.createFromText(profileOverview)) : 
      EditorState.createWithContent(convertFromRaw(JSON.parse(profileOverview)))
  );
  const dispatch = useDispatch();

  const onSubmit = async () => {
    dispatch(updatePortfolioOverview(portfolioId, JSON.stringify(convertToRaw(overview.getCurrentContent()))));
    toggleModalActive(false);
  };

  return (
    <>
      <div className={clsx('modal', isModalActive && 'is-active')}>
        <div className="modal-background" />
        <div className={clsx('modal-card', styles.modal)}>
          <header className="has-background-white pt-40 pl-40 pr-40 is-flex is-justify-content-space-between">
            <p className="modal-card-title has-text-weight-semibold">Edit Overview</p>
            <button
              type="button"
              className="delete"
              aria-label="close"
              onClick={() => toggleModalActive(false)}
            />
          </header>
          <section className={clsx('modal-card-body p-0', styles['modal-body'])}>
            <div className="p-40">
              <div className="has-text-weight-bold is-size-6 mb-10">Overview</div>
              <Editor
                editorState={overview}
                onEditorStateChange={(v) => setOverview(v)}
                editorClassName={styles.editor}
                toolbarClassName={styles.toolbar}
                toolbarStyle={{ margin: 0, border: `1px solid ${gray400}` }}
                toolbar={{
                  options: ['inline', 'link', 'list'],
                  inline: {
                    inDropdown: false,
                    options: ['bold', 'italic'],
                  },
                  list: {
                    inDropdown: false,
                    options: ['unordered'],
                  },
                  link: {
                    inDropdown: false,
                    showOpenOptionOnHover: true,
                    defaultTargetOption: '_blank',
                    options: ['link'],
                  },
                }}
              />
              {/* TODO: Will be added after markdown implementation */}
              <div className="is-flex is-align-items-center is-justify-content-right mt-20 mb-60">
                  {/* You can use markdown to format your personal overview.
                  <a href={`${SEMA_FAQ_URL}#${SEMA_FAQ_SLUGS.MARKDOWN}`}>
                    <span className="ml-20 has-text-primary">
                      Learn More
                    </span>
                  </a> */}
              {/* </div> */}
                <div>
                  <button type="button" className="button" onClick={() => toggleModalActive(false)}>Cancel</button>
                  <button type="button" className="button is-primary ml-10" onClick={() => onSubmit({ overview })}>Save changes</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

EditPortfolio.propTypes = {
  isModalActive: PropTypes.bool.isRequired,
  toggleModalActive: PropTypes.func.isRequired,
  profileOverview: PropTypes.string.isRequired,
  portfolioId: PropTypes.string.isRequired,
};

export default EditPortfolio;
