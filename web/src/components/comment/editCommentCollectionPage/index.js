import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import EditCommentCollectionForm from '../editCommentCollectionForm';
import { collectionsOperations } from 'src/state/features/collections';

const { fetchCollectionById, updateCollection } = collectionsOperations;

const EditCommentCollectionPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { auth, collectionState } = useSelector((state) => ({
    auth: state.authState,
    collectionState: state.commentsState,
  }));

  const { token } = auth;
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
    if (collection) {
      const { name, description, tags } = collection;
      setValue('name', name);
      setValue('description', description);
      setValue('tags', tags);
    }
  }, [collection]);

  const onSubmit = async (data) => {
    const updatedCollection = await dispatch(updateCollection(collection._id, {
      collection: data
    }, token));
    if (updatedCollection?._id) {
      window.location.href = `/suggested-comments?cid=${collection._id}`
    }
  }

  return(
    <>
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
      { collection?.tags && (<EditCommentCollectionForm register={register} formState={formState} setValue={setValue} watch={watch} />) }
    </>
  )
}

export default EditCommentCollectionPage;