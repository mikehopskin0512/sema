import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import EditCommentCollectionForm from '../editCommentCollectionForm';
import { CheckOnlineIcon } from '../../Icons';
import Toaster from '../../toaster';
import { alertOperations } from '../../../state/features/alerts';
import { collectionsOperations } from '../../../state/features/collections';
import { PATHS } from '../../../utils/constants';

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
      window.location.href = PATHS.SUGGESTED_SNIPPETS._;
    }
    setLoading(false);
  }

  return (
    <>
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
      <div className="is-flex px-10 mb-25 is-justify-content-space-between is-align-items-center is-flex-wrap-wrap">
        <div className="is-flex is-flex-wrap-wrap is-align-items-center">
          <p className="has-text-weight-semibold has-text-black-950 is-size-4 mr-10">
            Add a Snippet Collection
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
      <EditCommentCollectionForm register={register} formState={formState} setValue={setValue} watch={watch} />
    </>
  );
}

export default AddCommentCollection;
