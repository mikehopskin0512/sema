import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import LabelForm, { initialValues } from '../../components/labels-management/LabelForm';
import withLayout from '../../components/layout';
import Loader from '../../components/Loader';
import Toaster from '../../components/toaster';
import Helmet from '../../components/utils/Helmet';
import usePermission from '../../hooks/usePermission';
import { alertOperations } from '../../state/features/alerts';
import { tagsOperations } from '../../state/features/tags';
import {PATHS, SEMA_CORPORATE_ORGANIZATION_ID} from '../../utils/constants';
import { ArrowLeftIcon, CheckOnlineIcon, PlusIcon } from '../../components/Icons';
import { black950 } from '../../../styles/_colors.module.scss';
import useLocalStorage from '../../hooks/useLocalStorage';

const { clearAlert } = alertOperations;
const { createTags, fetchTagList } = tagsOperations;

export const validateTags = (tags, existingTags = [], currentTag = false) => {
  let hasErrors = false;
  const errors = tags.map((tag) => {
    let errs = {};
    if (tags.filter((item) => item.label.toLowerCase() === tag.label.toLowerCase()).length > 1) {
      hasErrors = true;
      errs = {
        ...errs,
        label: 'Label names should be unique'
      }
    }
    if (existingTags.find((existing) => existing.label.toLowerCase() === tag.label.toLowerCase()) && !currentTag) {
      hasErrors = true;
      errs = {
        ...errs,
        label: 'Label already exists in the database.'
      }
    }
    if (!tag.label) {
      hasErrors = true;
      errs = {
        ...errs,
        label: 'Label name is required!'
      }
    }
    if (!tag.type) {
      hasErrors = true;
      errs = {
        ...errs,
        type: 'Type is required!'
      }
    }
    return errs;
  });
  if (hasErrors) {
    return errors;
  }
  return false;
}

const AddLabels = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [accountData] = useLocalStorage('sema_selected_organization');
  const { isOrganizationAdminOrLibraryEditor, isSemaAdmin } = usePermission();
  const isAuthorized = useMemo(() => isOrganizationAdminOrLibraryEditor());

  const { tagsState, auth, alerts } = useSelector((state) => ({
    tagsState: state.tagsState,
    auth: state.authState,
    alerts: state.alertsState,
  }));

  const [tags, setTags] = useState([initialValues]);
  const [errors, setErrors] = useState([]);

  const { showAlert, alertType, alertLabel } = alerts;
  const { token } = auth;
  const { isFetching, tags: existingTags } = tagsState;

  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  useEffect(() => {
    dispatch(fetchTagList(token))
  }, []);

  const goBack = async () => {
    await router.back();
  };

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

  const onAddLabel = () => {
    setTags([...tags, initialValues]);
  }

  const onRemove = (id) => {
    setTags(tags.filter((_tag, index) => index !== id));
  }

  const onSubmit = () => {
    const {organization: {_id: organizationId}} = accountData;
    setErrors([]);
    const tagsErrors = validateTags(tags, existingTags);
    if (tagsErrors) {
      setErrors([...tagsErrors]);
      return;
    }
    const data = dispatch(createTags(tags, token));
    if (data) {
      router.push({
        pathname: PATHS.ORGANIZATIONS.SETTINGS(organizationId),
        query: { tab: 'labels' },
      });
    }
  };

  useEffect(() => {
    if (!isAuthorized) {
      router.replace('/');
    }
  }, []);

  if (!isAuthorized) {
    return(
      <div className="is-flex is-align-items-center is-justify-content-center" style={{ height: '50vh' }}>
        <Loader />
      </div>
    )
  }

  return(
    <div className="my-50 px-10">
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
      <Helmet title="Add label" />
      <div className="is-flex is-align-items-center px-10 mb-25">
        <a className="mr-8 is-flex" onClick={goBack} aria-hidden>
          <ArrowLeftIcon size="small" color={black950} />
        </a>
        <nav className="breadcrumb" aria-label="breadcrumbs">
          <ul>
            {isSemaAdmin() && <li><a href={PATHS.LABELS_MANAGEMENT} className="has-text-grey">Label Management</a></li>}
            <li className="is-active has-text-weight-semibold"><div className="px-5">Add Labels</div></li>
          </ul>
        </nav>
      </div>
      <div className="is-flex mb-25 is-justify-content-space-between is-align-items-center">
        <div className="is-flex is-flex-wrap-wrap is-align-items-center">
          <p className="has-text-weight-semibold has-text-black-950 is-size-4 mr-10">
            Add Labels
          </p>
        </div>
        <div className="is-flex">
          <button
            className="button is-small is-outlined is-primary border-radius-4px mr-10"
            type="button"
            onClick={goBack}
            disabled={isFetching}
          >
            Cancel
          </button>
          <button
            className={clsx("button is-small is-primary border-radius-4px", isFetching && 'is-loading')}
            type="button"
            onClick={onSubmit}
          >
            <CheckOnlineIcon size="small" />
            <span className="ml-8">
              Save
            </span>
          </button>
        </div>
      </div>
      { tags.map((_tag, index) => <LabelForm onChangeData={onChangeData} id={index} data={_tag} key={index} errors={errors} onRemove={onRemove} />)}
      <button
        className="button is-small is-outlined is-primary border-radius-4px mt-20"
        type="button"
        onClick={onAddLabel}
      >
        <PlusIcon size="small" />
        <span className="ml-8">
          Add another label
        </span>
      </button>
    </div>
  );
};

export default withLayout(AddLabels);
