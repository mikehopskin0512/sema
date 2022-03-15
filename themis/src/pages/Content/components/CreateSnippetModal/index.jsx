/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_COLLECTION_NAME, EVENTS } from '../../constants';
import { addNotification, changeSnippetComment } from '../../modules/redux/action';
import Button from '../inputs/Button';
import InputField from '../inputs/InputField';
import SelectField from '../inputs/SelectField';
import Modal from '../Modal';
import styles from './createSnippetModal.module.scss';
import { fireAmplitudeEvent, getAllCollection, getAllTags, saveSmartComment } from '../../modules/content-util';
import { mapTagsToOptions } from './helpers';

const semaLogo = chrome.runtime.getURL(
  'img/sema-logo.svg',
);

const CreateSnippetModal = () => {
  const dispatch = useDispatch();
  const { user: { isLoggedIn } } = useSelector((state) => state);
  const snippetComment = useSelector((state) => state.snippetComment);
  const isActive = !!snippetComment;
  const [collections, setCollections] = useState([]);
  const [collectionId, setCollectionId] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [languagesOptions, setLanguagesOptions] = useState([]);
  const [labelsOptions, setLabelsOptions] = useState([]);
  const [language, setLanguage] = useState(undefined);
  const [label, setLabel] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [sourceLink, setSourceLink] = useState('');
  const [author, setAuthor] = useState('');
  const [sourceFieldsVisible, setSourceFieldsVisible] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    getAllCollection()
      .then(setCollections)
      .catch(() => setCollections([]));
    getAllTags()
      .then((tags) => {
        setLabelsOptions(mapTagsToOptions(tags, 'custom'));
        setLanguagesOptions(mapTagsToOptions(tags, 'language'));
      });
  }, [isLoggedIn]);

  useEffect(() => {
    if (collectionId) {
      return;
    }
    const defaultCollection = collections.find(({ collectionData }) => {
      const collectionName = collectionData.name.toLowerCase();
      return collectionName === DEFAULT_COLLECTION_NAME;
    });
    if (defaultCollection) {
      setCollectionId(defaultCollection.collectionData._id);
    }
  }, [collections]);

  useEffect(() => {
    setComment(snippetComment);
  }, [snippetComment]);

  const onClose = () => {
    dispatch(changeSnippetComment({ comment: '' }));
  };
  const onSubmit = async () => {
    const existingTags = [label, language].filter((item) => item);
    try {
      fireAmplitudeEvent(EVENTS.CLICKED_SAVE_TO_MY_COMMENTS);
      await saveSmartComment({
        collectionId,
        comments: [
          {
            title,
            comment,
            author,
            collectionId,
            source: {
              name: sourceName,
              url: sourceLink,
            },
            tags: { existingTags },
          },
        ],
      });
      dispatch(addNotification({
        type: 'success',
        title: 'Snippet saved',
        text: 'The Snippet was saved to the collection My Snippets',
        isClosedBtn: true,
      }));
      onClose();
    } catch (e) {
      dispatch(addNotification({
        type: 'error',
        title: 'Snippet not saved',
        text: 'Please try again or report the problem',
        isClosedBtn: true,
      }));
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Modal isActive={isActive}>
      <form
        className={styles.modal}
        onSubmit={onSubmit}
      >
        <header className={styles.header}>
          <h2 className={styles.title}>Create New Snippet</h2>
          <div style={{ width: '200px' }}>
            <SelectField
              disabled
              options={collections.map((item) => ({
                label: item.collectionData.name,
                value: item.collectionData._id,
              }))}
              value={collectionId}
              onInput={setCollectionId}
            />
          </div>
        </header>
        <main>
          <div className={styles['form-field']}>
            <InputField
              title="Title"
              isRequired
              value={title}
              placeholder="Title"
              onInput={setTitle}
            />
          </div>
          <div className={styles['form-field']}>
            <InputField
              title="Body"
              isTextarea
              isRequired
              value={comment}
              placeholder="Comment"
              onInput={setComment}
            />
          </div>
          <div className={`${styles['form-field']} sema-is-flex`}>
            <div style={{ width: '50%' }} className="sema-mr-4">
              <SelectField
                title="Language"
                placeholder="E.g.: Java"
                options={languagesOptions}
                value={language}
                onInput={setLanguage}
              />
            </div>
            <div style={{ width: '50%' }}>
              <SelectField
                title="Label"
                options={labelsOptions}
                value={label}
                placeholder="E.g.: APIs, Security"
                onInput={setLabel}
              />
            </div>
          </div>
          <div>
            <div
              className={styles['source-field-switcher']}
              onClick={() => setSourceFieldsVisible(!sourceFieldsVisible)}
            >
              Not your original work?
            </div>

            <div
              className={styles['source-fields']}
              style={{ display: sourceFieldsVisible ? 'block' : 'none' }}
            >
              <div className="sema-is-flex">
                <div style={{ width: '50%' }} className="sema-mr-4">
                  <InputField
                    title="Source Name"
                    value={sourceName}
                    onInput={setSourceName}
                  />
                </div>
                <div style={{ width: '50%' }}>
                  <InputField
                    title="Source Link"
                    value={sourceLink}
                    onInput={setSourceLink}
                  />
                </div>
              </div>
              <div className={styles['form-field']}>
                <InputField
                  title="Author Name"
                  value={author}
                  placeholder="GitHub User Name"
                  onInput={setAuthor}
                />
              </div>
            </div>
          </div>
        </main>
        <div className={styles.controls}>
          <img
            src={semaLogo}
            className={styles.logo}
            alt="sema-logo"
          />
          <Button
            onClick={onClose}
            style={{ marginRight: '16px' }}
            secondary
          >
            Cancel
          </Button>
          <Button type="submit">
            Save New Snippet
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateSnippetModal;
