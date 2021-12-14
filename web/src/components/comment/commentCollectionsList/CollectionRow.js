import React from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { collectionsOperations } from '../../../state/features/collections';
import { PATHS, DEFAULT_COLLECTION_NAME } from '../../../utils/constants';
import { PlusIcon } from '../../../components/Icons';

const { updateCollectionIsActiveAndFetchCollections } = collectionsOperations;

const CollectionRow = ({ data }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token } = useSelector((state) => state.authState);
  const { collectionData, isActive } = data ?? {};
  const { _id, name, description, source, author, commentsCount } = collectionData;

  const onChangeToggle = (e) => {
    e.stopPropagation();
    dispatch(updateCollectionIsActiveAndFetchCollections(_id, token));
  };

  const onClickChild = (e) => {
    e.stopPropagation();
  };

  const onClickAddComment = (e) => {
    e.stopPropagation();
    router.push(`${PATHS.SUGGESTED_SNIPPETS.ADD}?cid=${_id}`)
  };

  return (
    <Link href={`?cid=${_id}`}>
      <tr className="has-background-white my-10 is-clickable">
        <td className="py-15 has-background-white px-10" width={80}>
          <div className="is-flex is-flex-direction-column is-justify-content-center" onClickChild>
            <div className="field" aria-hidden onClick={onClickChild}>
              <input
                id={`activeSwitch-${_id}`}
                type="checkbox"
                onChange={onChangeToggle}
                name={`activeSwitch-${_id}`}
                className="switch is-rounded"
                checked={isActive}
              />
              <label htmlFor={`activeSwitch-${_id}`} />
            </div>
          </div>
        </td>
        <td className="py-15 has-background-white px-10 is-hidden-mobile">
          <div className="is-flex is-align-items-center is-justify-content-space-between" onClick={onClickChild}>
            <p className={"is-size-7 has-text-weight-semibold"} style={{ width: name.toLowerCase() === DEFAULT_COLLECTION_NAME && 150 }}>
              {name}
            </p>
            {name.toLowerCase() === DEFAULT_COLLECTION_NAME && (
              <div
                className={'button is-primary is-outlined is-clickable has-text-weight-semibold is-size-7'}
                onClick={onClickAddComment}
                aria-hidden
              >
                <div className="is-flex is-align-items-center mr-10">
                  <PlusIcon size="small" />
                </div>
                Add a snippet
              </div>
            )}
          </div>
        </td>
        <td className="py-15 has-background-white px-10 is-hidden-mobile">
          <div className="is-flex is-flex-direction-column is-justify-content-center">
            <p className="is-size-7">
              {description}
            </p>
          </div>
        </td>
        <td className="py-15 has-background-white px-10 is-hidden-mobile" width={100}>
          <div className="is-flex is-flex-direction-column is-justify-content-center">
            <p className="is-size-7 has-text-weight-semibold">
              {source}
            </p>
          </div>
        </td>
        <td className="py-15 has-background-white px-10 is-hidden-mobile" width={100}>
          <div className="is-flex is-flex-direction-column is-justify-content-center">
            <p className="is-size-7 has-text-weight-semibold">
              {author}
            </p>
          </div>
        </td>
        <td className="py-15 has-background-white px-10 is-hidden-mobile" width={100}>
          <div className="is-flex is-flex-direction-column is-justify-content-center">
            <p className="is-size-7 has-text-weight-semibold has-text-centered">
              {commentsCount}
            </p>
          </div>
        </td>
      </tr>
    </Link>
  )
}

CollectionRow.propTypes = {
  data: PropTypes.object.isRequired,
};

export default CollectionRow;
