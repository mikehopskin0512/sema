import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import EditCommentCollectionForm from '../editCollectionForm';
import { CheckOnlineIcon } from '../../../Icons';
import Toaster from '../../../toaster';
import { alertOperations } from '../../../../state/features/alerts';
import { collectionsOperations } from '../../../../state/features/collections';
import { COLLECTION_TYPE, PATHS, PROFILE_VIEW_MODE } from '../../../../utils/constants';
import schema from '../schema';

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
  const { token } = auth;

  const { handleSubmit, formState, control } = useForm({
    defaultValues: {
      languages: [],
      others: [],
      comments: [],
      author: '',
      isActive: true,
      sourceName: '',
      sourceLink: '',
      name: '',
      description: '',
      isCommunityCollection: true,
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  const onSubmit = async (data) => {
    const isOrganizationView = auth.profileViewMode === PROFILE_VIEW_MODE.ORGANIZATION_VIEW;
    const collectionType = isOrganizationView ? COLLECTION_TYPE.ORGANIZATION : COLLECTION_TYPE.PERSONAL;
    setLoading(true);
    const { languages, others, comments, author, isActive, sourceName, sourceLink, name, description } = data;
    const collection = {
      isActive,
      author,
      comments,
      type: data.isCommunityCollection ? COLLECTION_TYPE.COMMUNITY : collectionType,
      name,
      description,
      source: {
        name: sourceName,
        url: sourceLink,
      },
      tags: [...languages, ...others],
    };

    try {
      await dispatch(createCollections({
        collection,
        organizationId: auth.selectedOrganization ? auth.selectedOrganization._id : null,
      }, token));
      await router.push(PATHS.SNIPPETS._);
    } finally {
      setLoading(false);
    }
  };

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
            className={clsx(
              "button is-small is-primary border-radius-4px",
              loading && "is-loading"
            )}
            type="button"
            onClick={handleSubmit(onSubmit)}
          >
            <CheckOnlineIcon size="small" />
            <span className="ml-8">Save</span>
          </button>
        </div>
      </div>
      <EditCommentCollectionForm
        errors={formState.errors}
        control={control}
      />
    </>
  );
}

export default AddCommentCollection;

