import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import EditCommentCollectionForm from '../editCommentCollectionForm';
import { collectionsOperations } from '../../../state/features/collections';

const { createCollections } = collectionsOperations;

const AddCommentCollection = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user, token } = useSelector((state) => state.authState);
  const { isSemaAdmin, identities } = user;

  const github = identities.find((identity) => identity.provider === 'github');

  const {
    register, handleSubmit, formState, setValue, reset, setError,
  } = useForm({
    defaultValues: {
      tags: [],
      comments: [],
      author: isSemaAdmin ? "sema" : github.username,
      isActive: true,
    },
  });

  const onSubmit = async (data) => {
    const collections = await dispatch(createCollections({
      collections: [data]
    }, token));
    if (collections.length > 0) {
      window.location.href = '/suggested-comments';
    }
  }

  return(
    <form onSubmit={handleSubmit(onSubmit)}>
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
          >
            Cancel
          </button>
          <button
            className="button is-small is-primary border-radius-4px"
            type="button"
            onClick={handleSubmit(onSubmit)}
          >
            <FontAwesomeIcon icon={faCheck} className="mr-10" />
            Save
          </button>
        </div>
      </div>
      <EditCommentCollectionForm register={register} formState={formState} setValue={setValue} />
    </form>
  );
}

export default AddCommentCollection;