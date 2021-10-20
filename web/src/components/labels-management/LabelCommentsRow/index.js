import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { suggestCommentsOperations } from '../../../state/features/suggest-comments';

const { updateSuggestComment } = suggestCommentsOperations;

const LabelCommentsRow = ({ data, token, tagId }) => {
  const dispatch = useDispatch();
  const [isOn, setIsOn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tagIds, setTagIds] = useState([]);

  const { title, _id, tags = [] } = data;

  useEffect(() => {
    if (tags.length > 0) {
      setTagIds(tags.map((tag) => tag.tag))
    }
  }, [tags]);

  const onChangeToggle = async () => {
    setLoading(true);
    const body = { ...data };
    let message = {
      errorMsg: 'Unable to remove tag from this comment!',
      successMsg: 'Successfully removed tag from this comment!',
    }
    if (isOn) {
      const existingTags = tagIds.filter((tag) => tag !== tagId);
      message = {
        errorMsg: 'Unable to remove tag from this comment!',
        successMsg: 'Successfully removed tag from this comment!',
      }
      body.tags = {
        existingTags
      }
      setTagIds(existingTags);
    } else {
      const existingTags = [...tagIds, tagId];
      message = {
        errorMsg: 'Unable to add tag to this comment!',
        successMsg: 'Successfully added tag to this comment!',
      }
      body.tags = {
        existingTags
      }
      setTagIds(existingTags);
    }
    delete body.__v;
    await dispatch(updateSuggestComment(_id, body, token, message));
    setIsOn(!isOn);
    setLoading(false);
  }

  return(
    <tr className="has-background-white my-10">
      <td className="py-15 has-background-white px-10">
        <div className="is-flex">
          <div className="field my-0 mr-10" aria-hidden>
            <input
              id={`activeSwitch-${_id}`}
              type="checkbox"
              onChange={onChangeToggle}
              name={`activeSwitch-${_id}`}
              className="switch is-rounded"
              checked={isOn}
              disabled={loading}
            />
            <label htmlFor={`activeSwitch-${_id}`} />
          </div>
          <p className="is-size-7">
            {title}
          </p>
        </div>
      </td>
    </tr>
  )
}

export default LabelCommentsRow;