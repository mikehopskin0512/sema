import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { CheckOnlineIcon } from '../../Icons';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import EditCommentCollectionForm from '../editCommentCollectionForm';
import { alertOperations } from '../../../state/features/alerts';
import { collectionsOperations } from '../../../state/features/collections';
import Toaster from '../../toaster';
import Loader from '../../Loader';
import { PATHS } from '../../../utils/constants';
import useAuthEffect from '../../../hooks/useAuthEffect';
import { addTags } from '../../../utils';

const { clearAlert } = alertOperations;
const { fetchCollectionById, updateCollection } = collectionsOperations;

const EditCommentCollectionPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { auth, collectionState, alerts } = useSelector((state) => ({
    auth: state.authState,
    collectionState: state.commentsState,
    alerts: state.alertsState,
  }));

  const { showAlert, alertType, alertLabel } = alerts;
  const { token, user } = auth;
  const { query: { cid } } = router;
  const { collection } = collectionState;

  const {
    register, handleSubmit, formState, setValue, watch
  } = useForm();

  useAuthEffect(() => {
    if (cid) {
      dispatch(fetchCollectionById(cid, token));
    }
  }, [cid]);

  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  useEffect(() => {
    if (collection) {
      const { name, description, tags = [], author, source } = collection;
      setValue('name', name);
      setValue('description', description);
      setValue('author', author);
      setValue('sourceName', source?.name);
      setValue('sourceLink', source?.url);
      setValue('languages', addTags(tags, ['language']));
      setValue('others', addTags(tags, ['guide', 'other', 'custom']));
    }
  }, [collection]);

  const onSubmit = async (data) => {
    setLoading(true);
    const { languages, others, comments, author, isActive, sourceName, sourceLink, name, description } = data;
    const collectionData = {
      isActive,
      author,
      comments,
      name,
      description,
      source: {
        name: sourceName,
        url: sourceLink
      },
      tags: [...languages, ...others],
    }
    const updatedCollection = await dispatch(updateCollection(collection._id, {
      collection: collectionData
    }, token));
    if (updatedCollection?._id) {
      await router.push(PATHS.SUGGESTED_SNIPPETS._);
    }
    setLoading(false);
  }

  return(
    <>
      <div className="is-flex px-10 mb-25 is-justify-content-space-between is-align-items-center is-flex-wrap-wrap">
        <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
        <div className="is-flex is-flex-wrap-wrap is-align-items-center">
          <p className="has-text-weight-semibold has-text-deep-black is-size-4 mr-10">
            Edit a Snippet Collection
          </p>
        </div>
        <div className="is-flex">
          <button
            className="button is-small is-outlined is-primary border-radius-4px mr-10"
            type="button"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            className={clsx("button is-small is-primary border-radius-4px", loading && "is-loading")}
            type="button"
            onClick={handleSubmit(onSubmit)}
          >
            <CheckOnlineIcon size="small" />
            <span className="ml-8">
              Save
            </span>
          </button>
        </div>
      </div>
      { collection?.tags ?
        (<EditCommentCollectionForm register={register} formState={formState} setValue={setValue} watch={watch} cid={cid}/>) :
        (<div className="is-flex is-align-items-center is-justify-content-center" style={{ height: '20vh' }}>
          <Loader/>
        </div>) }
    </>
  )
}

export default EditCommentCollectionPage;
