import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faSearch } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { validateTags } from './add';
import LabelForm, { initialValues } from '../../components/labels-management/LabelForm';
import withLayout from '../../components/layout';
import Loader from '../../components/Loader';
import Toaster from '../../components/toaster';
import Helmet from '../../components/utils/Helmet';
import LabelsTable from '../../components/labels-management/LabelsTable';
import LabelCommentsRow from '../../components/labels-management/LabelCommentsRow';
import { alertOperations } from '../../state/features/alerts';
import { tagsOperations  } from '../../state/features/tags';

const { clearAlert } = alertOperations;
const { updateTagById, fetchTagsById } = tagsOperations;

const EditLabel = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { query } = router;
  const { id } = query;

  const { tagsState, auth, alerts } = useSelector((state) => ({
    tagsState: state.tagsState,
    auth: state.authState,
    alerts: state.alertsState,
  }));

  const [tags, setTags] = useState([initialValues]);
  const [errors, setErrors] = useState([]);
  const [search, setSearch] = useState('');

  const { showAlert, alertType, alertLabel } = alerts;
  const { token } = auth;
  const { isFetching, tag } = tagsState;

  useEffect(() => {
    dispatch(fetchTagsById(id, token));
  }, []);

  useEffect(() => {
    setTags([tag])
  }, [tag]);

  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  const onChangeData = (name, val, index) => {
    const newTags = tags.map((tag, idx) => {
      if (idx === index) {
        return {
          ...tag,
          [name]: val
        }
      }
      return tag
    })
    setTags(newTags);
  };

  const onCancel = async () => {
    await router.back();
  };

  const onSubmit = () => {
    setErrors([]);
    const tagsErrors = validateTags(tags);
    if (tagsErrors) {
      setErrors([...tagsErrors]);
      return;
    }
    if (tags.length > 0) {
      dispatch(updateTagById(tags[0]._id, tags[0], token));
    }
  };

  return(
    <div className="my-50 px-10">
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
      <Helmet title="Edit label" />
      <div className="is-flex is-align-items-center px-10 mb-25">
        <a href="/labels-management">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-10" color="#000" />
        </a>
        <nav className="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li><a href="/labels-management" className="has-text-grey">Label management</a></li>
            <li className="is-active has-text-weight-semibold"><div className="px-5">Edit Label</div></li>
          </ul>
        </nav>
      </div>
      <div className="is-flex mb-25 is-justify-content-space-between is-align-items-center">
        <div className="is-flex is-flex-wrap-wrap is-align-items-center">
          <p className="has-text-weight-semibold has-text-deep-black is-size-4 mr-10">
            Edit label
          </p>
        </div>
        <div className="is-flex">
          <button
            className="button is-small is-outlined is-primary border-radius-4px mr-10"
            type="button"
            onClick={onCancel}
            disabled={isFetching}
          >
            Cancel
          </button>
          <button
            className={clsx("button is-small is-primary border-radius-4px", isFetching && 'is-loading')}
            type="button"
            onClick={onSubmit}
          >
            <FontAwesomeIcon icon={faCheck} className="mr-10" />
            Save
          </button>
        </div>
      </div>
      { isFetching ? (
        <div className="is-flex is-align-items-center is-justify-content-center" style={{ height: '55vh' }}>
          <Loader />
        </div>
      ) : tags.map((_tag, index) => 
        <div key={`tag-${index}`}>
          <LabelForm onChangeData={onChangeData} id={index} data={_tag} key={index} errors={errors} />
          <div className="has-background-white is-fullwidth px-15 py-10 my-15">
            <div className="control has-icons-left has-icons-left" style={{ width: 350 }}>
              <input
                className="input has-background-white is-small"
                type="input"
                placeholder="Search by Suggested Comment"
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faSearch} />
              </span>
            </div>
          </div>
          <LabelsTable
            data={_tag.suggestedComments?.filter((tag) => {
              return tag.title.toLowerCase().includes(search.toLowerCase());
            }) || []}
            columns={[{ label: 'Added On'}]}
            renderRow={(comment, index) => <LabelCommentsRow data={comment} token={token} tagId={id} key={`row-${index}`} />}
          />
        </div>
      ) }
    </div>
  )
}

export default withLayout(EditLabel);