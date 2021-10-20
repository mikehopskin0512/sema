import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { validateTags } from './add';
import LabelForm, { initialValues } from '../../components/labels-management/LabelForm';
import withLayout from '../../components/layout';
import Toaster from '../../components/toaster';
import Helmet from '../../components/utils/Helmet';
import { alertOperations } from '../../state/features/alerts';
import { tagsOperations  } from '../../state/features/tags';

const { clearAlert } = alertOperations;
const { createTags } = tagsOperations;

const EditLabel = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { query } = router;

  const { tagsState, auth, alerts } = useSelector((state) => ({
    tagsState: state.tagsState,
    auth: state.authState,
    alerts: state.alertsState,
  }));

  const [tags, setTags] = useState([initialValues]);
  const [errors, setErrors] = useState([]);

  const { showAlert, alertType, alertLabel } = alerts;
  const { token } = auth;
  const { isFetching } = tagsState;

  // useEffect(() => {
  //   dispatch()
  // }, []);

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
    const data = dispatch(createTags(tags, token));
    if (data) {
      router.push('/labels-management');
    }
  };

  return(
    <div className="my-50">
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
      <Helmet title="Edit label" />
      <div className="is-flex is-align-items-center px-10 mb-25">
        <a href="/labels-management" className="is-hidden-mobile">
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
      { tags.map((_tag, index) => <LabelForm onChangeData={onChangeData} id={index} data={_tag} key={index} errors={errors} />)}
    </div>
  )
}

export default withLayout(EditLabel);