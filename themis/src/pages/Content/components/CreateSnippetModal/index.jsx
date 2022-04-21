/* eslint-disable import/no-unresolved */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_COLLECTION_NAME, SEGMENT_EVENTS } from '../../constants';
import {
  addNotification,
  changeSnippetComment,
} from '../../modules/redux/action';
import Button from '../inputs/Button';
import InputField from '../inputs/InputField';
import SelectField from '../inputs/SelectField';
import Modal from '../Modal';
import styles from './createSnippetModal.module.scss';
import {
  getAllTags,
  saveSmartComment,
} from '../../modules/content-util';
import { mapTagsToOptions } from './helpers';
import { getActiveThemeClass } from '../../../../../utils/theme';
import { segmentTrack } from '../../modules/segment';
import GroupedSelectField from '../inputs/GroupedSelect';
import { FolderIcon } from '../icons/FolderIcon';

const semaLogo = chrome.runtime.getURL('img/sema-logo.svg');

const CreateSnippetModal = () => {
  const dispatch = useDispatch();
  const {
    teams,
    user: { isLoggedIn, collections: userCollections },
  } = useSelector((state) => state);

  const teamsCollections = teams
    .filter((team) => team.role.canCreateSnippets)
    .map(({ team }) => ({
      ...team,
      collections: team.collections.filter((collection) => collection.isActive),
    })).reduce((acc, item) => {
      acc.push(item?.collections ?? []);
      return acc;
    }, []).flat();

  const snippetComment = useSelector((state) => state.snippetComment);
  const isActive = !!snippetComment;
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
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
    if (!isLoggedIn || !userCollections) {
      return;
    }
    getAllTags().then((tags) => {
      setLabelsOptions(mapTagsToOptions(tags, 'custom'));
      setLanguagesOptions(mapTagsToOptions(tags, 'language'));
    });
  }, [isLoggedIn, userCollections]);

  useEffect(() => {
    if (selectedCollectionId) {
      return;
    }
    const defaultCollection = userCollections.find(({ collectionData }) => {
      const collectionName = collectionData.name.toLowerCase();
      return collectionName === DEFAULT_COLLECTION_NAME;
    });

    if (defaultCollection) {
      setSelectedCollectionId(defaultCollection.collectionData?._id);
    }
  }, [userCollections]);

  useEffect(() => {
    setComment(snippetComment);
  }, [snippetComment]);

  const onClose = () => {
    dispatch(changeSnippetComment({ comment: '' }));
  };
  const onSubmit = async () => {
    const existingTags = [label, language].filter((item) => item);
    try {
      segmentTrack(SEGMENT_EVENTS.CLICKED_SAVE_TO_MY_COMMENTS);
      await saveSmartComment({
        collectionId: selectedCollectionId,
        comments: [
          {
            title,
            comment,
            author,
            selectedCollectionId,
            source: {
              name: sourceName,
              url: sourceLink,
            },
            tags: { existingTags },
          },
        ],
      });
      dispatch(
        addNotification({
          type: 'success',
          title: 'Snippet saved',
          text: 'The Snippet was saved to the collection My Snippets',
          isClosedBtn: true,
        })
      );
      onClose();
    } catch (e) {
      dispatch(
        addNotification({
          type: 'error',
          title: 'Snippet not saved',
          text: 'Please try again or report the problem',
          isClosedBtn: true,
        })
      );
    }
  };

  const onCollectionSelect = (id) => {
    setSelectedCollectionId(id);
  };

  const selectOptionsMapper = (obj) => {
    return {
      id: obj.collectionData?._id,
      name: obj.name ?? obj.collectionData?.name,
    };
  };

  const preparedCollectionsData = useMemo(() => {
    const variants = {};
    if (userCollections.length) {
      variants.userCollections = {
        fieldName: 'My Snippets',
        options: userCollections ?? [],
      };
    }

    if (teamsCollections.length) {
      variants.teamCollections = {
        fieldName: 'Team Snippets',
        options: teamsCollections ?? [],
      };
    }

    return variants;
  }, [teamsCollections, userCollections]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Modal isActive={isActive}>
      <form className={`${styles[getActiveThemeClass()]} ${styles.modal}`} onSubmit={onSubmit}>
        <header className={styles.header}>
          <h2 className={styles.title}>Create New Snippet</h2>
          <div style={{ width: '260px' }}>
            <GroupedSelectField
              icon={<FolderIcon />}
              onChange={onCollectionSelect}
              options={preparedCollectionsData}
              placeHolder="Choose Snippet Collection"
              value={selectedCollectionId}
              optionsMapper={selectOptionsMapper}
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
          <img src={semaLogo} className={styles.logo} alt="sema-logo" />
          <Button onClick={onClose} style={{ marginRight: '16px' }} secondary>
            Cancel
          </Button>
          <Button type="submit">Save New Snippet</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateSnippetModal;
