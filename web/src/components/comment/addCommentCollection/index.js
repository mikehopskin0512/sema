import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import EditCommentCollectionForm from '../editCommentCollectionForm';
import { CheckOnlineIcon } from '../../Icons';
import Toaster from '../../toaster';
import { alertOperations } from '../../../state/features/alerts';
import { collectionsOperations } from '../../../state/features/collections';
import { PATHS } from '../../../utils/constants';
import { EditComments } from "../../../data/permissions";
import usePermission from '../../../hooks/usePermission';

const { clearAlert } = alertOperations;
const { createCollections } = collectionsOperations;

const AddCommentCollection = () => {
  const { checkAccess } = usePermission();
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { auth, alerts } = useSelector((state) => ({
    auth: state.authState,
    alerts: state.alertsState,
  }));
  const { showAlert, alertType, alertLabel } = alerts;
  const { user = {}, token } = auth;
  const { isSemaAdmin, identities = [], roles = [] } = user;

  const github = identities.find((identity) => identity.provider === 'github');

  const {
    register, handleSubmit, formState, setValue, watch,
  } = useForm({
    defaultValues: {
      languages: [],
      others: [],
      comments: [],
      author: checkAccess({name: 'Sema Super Team'}, EditComments) ? "sema" : github.username,
      isActive: true,
      sourceName: '',
      sourceLink: '',
      name: '',
      description: '',
      isPopulate: true,
    },
  });

  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  const onSubmit = async (data) => {
    setLoading(true);
    const { languages, others, comments, author, isActive, sourceName, sourceLink, name, description } = data;
    const collection = {
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
    
    let currentSemaTeamId = null;
    if (data.isPopulate && roles && roles.length > 0) {
      // TODO this hardcoded Sema Super Team will be replaced very soon
      const semaTeam = roles.find(role => role && role.team && role.team.name === 'Sema Super Team');
      if (semaTeam) currentSemaTeamId = semaTeam.team._id;
    }
    
    const collections = await dispatch(createCollections({
      collections: new Array(collection),
      team: currentSemaTeamId
    }, token));
    
    if (collections.length > 0) {
      await router.push(PATHS.SUGGESTED_SNIPPETS._)
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

