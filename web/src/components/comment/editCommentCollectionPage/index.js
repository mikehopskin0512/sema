import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import EditCommentCollectionForm from '../editCommentCollectionForm';
import { collectionsOperations } from 'src/state/features/collections';
import Toaster from '../../toaster';
import Loader from '../../Loader';
import { alertOperations } from '../../../state/features/alerts';

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
  const { isSemaAdmin } = user;
  const { cid } = router;
  const { collection } = collectionState;

  const {
    register, handleSubmit, formState, setValue, watch
  } = useForm();

  useEffect(() => {
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
      const { name, description, tags } = collection;
      setValue('name', name);
      setValue('description', description);
      setValue('tags', tags);
    }
  }, [collection]);

  const onSubmit = async (data) => {
    setLoading(true);
    const updatedCollection = await dispatch(updateCollection(collection._id, {
      collection: data
    }, token));
    if (updatedCollection?._id) {
      window.location.href = `/suggested-comments`
    }
    setLoading(false);
  }

  if (!isSemaAdmin) {
    return(
      <div className="has-text-centered my-50">
        <p className="has-text-weight-semibold is-size-6">Unauthorized</p>
      </div>
    );
  }

  return(
    <>
      <div className="is-flex px-10 mb-25 is-justify-content-space-between is-align-items-center is-flex-wrap-wrap">
        <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
        <div className="is-flex is-flex-wrap-wrap is-align-items-center">
          <p className="has-text-weight-semibold has-text-deep-black is-size-4 mr-10">
            Add a Comment Collection
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
            <FontAwesomeIcon icon={faCheck} className="mr-10" />
            Save
          </button>
        </div>
      </div>
      { collection?.tags ?
        (<EditCommentCollectionForm register={register} formState={formState} setValue={setValue} watch={watch} />) :
        (<div className="is-flex is-align-items-center is-justify-content-center" style={{ height: '20vh' }}>
          <Loader/>
        </div>) }
    </>
  )
}

export default EditCommentCollectionPage;