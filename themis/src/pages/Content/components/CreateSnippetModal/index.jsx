/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { DEFAULT_COLLECTION_NAME, SEGMENT_EVENTS } from '../../constants';
import {
  addNotification,
  changeSnippetComment,
} from '../../modules/redux/action';
import Button from '../inputs/Button';
import InputField from '../inputs/InputField';
import SelectField from '../inputs/SelectField';
import Modal from '../Modal';
import CollectionsSelector from './collectionsSelector';
import styles from './createSnippetModal.module.scss';
import {
  getAllTags,
  saveSmartComment,
} from '../../modules/content-util';
import { mapTagsToOptions } from './helpers';
import { getActiveThemeClass } from '../../../../../utils/theme';
import { segmentTrack } from '../../modules/segment';
import schema from './validationSchema';

const semaLogo = chrome.runtime.getURL('img/sema-logo.svg');

const CreateSnippetModal = () => {
  const dispatch = useDispatch();
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      title: '',
      comment: '',
      source: {
        name: '',
        url: '',
      },
      author: '',
      language: '',
      label: '',
    },
    resolver: yupResolver(schema),
  });
  const {
    user: { _id: userId, isLoggedIn, collections: userCollections },
  } = useSelector((state) => state);

  const snippetComment = useSelector((state) => state.snippetComment);
  const isActive = !!snippetComment;
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [languagesOptions, setLanguagesOptions] = useState([]);
  const [labelsOptions, setLabelsOptions] = useState([]);
  const [sourceFieldsVisible, setSourceFieldsVisible] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !userCollections) {
      return;
    }
    getAllTags().then((tags) => {
      if (Array.isArray(tags)) {
        setLabelsOptions(mapTagsToOptions(tags, 'custom'));
        setLanguagesOptions(mapTagsToOptions(tags, 'language'));
      }
    });
  }, [isLoggedIn, userCollections]);
  useEffect(() => {
    if (selectedCollectionId) {
      return;
    }
    const defaultCollection = userCollections.find(({ collectionData }) => {
      const collectionName = collectionData?.name.toLowerCase();
      return collectionName === DEFAULT_COLLECTION_NAME;
    });

    if (defaultCollection) {
      setSelectedCollectionId(defaultCollection.collectionData?._id);
    }
  }, [userCollections]);
  useEffect(() => {
    reset({ title: '', comment: snippetComment });
  }, [snippetComment]);

  const onClose = () => {
    dispatch(changeSnippetComment({ comment: '' }));
  };
  const onSubmit = async (formData) => {

    const existingTags = [formData.label, formData.language].filter((item) => item);
    try {
      segmentTrack(SEGMENT_EVENTS.CLICKED_SAVE_TO_MY_COMMENTS, userId);
      await saveSmartComment({
        collectionId: selectedCollectionId,
        comments: [{
          ...formData,
          selectedCollectionId,
          tags: { existingTags },
        }],
      });
      dispatch(
        addNotification({
          type: 'success',
          title: 'Snippet saved',
          text: 'The Snippet was saved to the collection My Snippets',
          isClosedBtn: true,
        }),
      );
      onClose();
    } catch (e) {
      dispatch(
        addNotification({
          type: 'error',
          title: 'Snippet not saved',
          text: 'Please try again or report the problem',
          isClosedBtn: true,
        }),
      );
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Modal isActive={isActive}>
      <form className={`${styles[getActiveThemeClass()]} ${styles.modal}`} onSubmit={handleSubmit(onSubmit)}>
        <header className={styles.header}>
          <h2 className={styles.title}>Create New Snippet</h2>
          <div style={{ width: '260px' }}>
            <CollectionsSelector
              value={selectedCollectionId}
              onChange={setSelectedCollectionId}
            />
          </div>
        </header>
        <main>
          <div className={styles['form-field']}>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, value } }) => (
                <InputField
                  title="Title"
                  isRequired
                  value={value}
                  placeholder="Title"
                  onInput={onChange}
                  error={errors?.title?.message}
                />
              )}
            />
          </div>
          <div className={styles['form-field']}>
            <Controller
              control={control}
              name="comment"
              render={({ field: { onChange, value } }) => (
                <InputField
                  title="Body"
                  isRequired
                  value={value}
                  placeholder="Comment"
                  onInput={onChange}
                  error={errors?.comment?.message}
                />
              )}
            />
          </div>
          <div className={`${styles['form-field']} sema-is-flex`}>
            <div style={{ width: '50%' }} className="sema-mr-4">
              <Controller
                control={control}
                name="language"
                render={({ field: { onChange, value } }) => (
                  <SelectField
                    title="Language"
                    placeholder="E.g.: Java"
                    options={languagesOptions}
                    value={value}
                    onInput={onChange}
                  />
                )}
              />
            </div>
            <div style={{ width: '50%' }}>
              <Controller
                control={control}
                name="label"
                render={({ field: { onChange, value } }) => (
                  <SelectField
                    title="Label"
                    options={labelsOptions}
                    value={value}
                    placeholder="E.g.: APIs, Security"
                    onInput={onChange}
                  />
                )}
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
                  <Controller
                    control={control}
                    name="source.name"
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        title="Source Name"
                        value={value}
                        onInput={onChange}
                      />
                    )}
                  />
                </div>
                <div style={{ width: '50%' }}>
                  <Controller
                    control={control}
                    name="source.url"
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        error={errors?.source?.url?.message}
                        isRequired
                        title="Source Link"
                        value={value}
                        onInput={onChange}
                      />
                    )}
                  />
                </div>
              </div>
              <div className={styles['form-field']}>
                <Controller
                  control={control}
                  name="author"
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      title="Author Name"
                      value={value}
                      placeholder="GitHub User Name"
                      onInput={onChange}
                    />
                  )}
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
