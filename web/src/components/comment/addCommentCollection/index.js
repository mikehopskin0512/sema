import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import EditCommentCollectionForm from '../editCommentCollectionForm';
import Toaster from '../../toaster';
import { alertOperations } from '../../../state/features/alerts';
import { collectionsOperations } from '../../../state/features/collections';

const { clearAlert } = alertOperations;
const { createCollections } = collectionsOperations;

const AddCommentCollection = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { auth, alerts } = useSelector((state) => ({
    auth: state.authState,
    alerts: state.alertsState,
  }));
  const { showAlert, alertType, alertLabel } = alerts;
  const { user, token } = auth;
  const { isSemaAdmin, identities = [] } = user;

  const github = identities.find((identity) => identity.provider === 'github');

  const {
    register, handleSubmit, formState, setValue, watch,
  } = useForm({
    defaultValues: {
      tags: [],
      comments: [],
      author: isSemaAdmin ? "sema" : github.username,
      isActive: true,
    },
  });

  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  const onSubmit = async (data) => {
    setLoading(true);
    const collections = await dispatch(createCollections({
      collections: [data]
    }, token));
    if (collections.length > 0) {
      window.location.href = '/suggested-comments';
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
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
      <div className="is-flex px-10 mb-25 is-justify-content-space-between is-align-items-center is-flex-wrap-wrap">
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
      <EditCommentCollectionForm register={register} formState={formState} setValue={setValue} watch={watch} />
    </>
  );
}

export default AddCommentCollection;