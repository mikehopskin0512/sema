import React, { useEffect, useMemo, useState } from 'react';
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
import usePermission from '../../hooks/usePermission';
import useLocalStorage from '../../hooks/useLocalStorage';
import { alertOperations } from '../../state/features/alerts';
import { tagsOperations  } from '../../state/features/tags';
import {PATHS, SEMA_CORPORATE_ORGANIZATION_ID} from '../../utils/constants';
import { ArrowLeftIcon, CheckOnlineIcon, SearchIcon } from '../../components/Icons';
import { black950 } from '../../../styles/_colors.module.scss';

const { clearAlert } = alertOperations;
const { updateTagAndReloadTag, fetchTagsById, fetchTagList } = tagsOperations;

const EditLabel = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isOrganizationAdminOrLibraryEditor } = usePermission();
  const [accountData] = useLocalStorage('sema_selected_organization');

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
  const { isFetching, tag, tags: existingTags } = tagsState;

  const isAuthorized = useMemo(() => isOrganizationAdminOrLibraryEditor(), [isOrganizationAdminOrLibraryEditor]);

  useEffect(() => {
    dispatch(fetchTagsById(id, token));
    dispatch(fetchTagList(token));
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
    const {organization: {_id: organizationId}} = accountData;
    setErrors([]);
    const tagsErrors = validateTags(tags, existingTags, tag);
    if (tagsErrors) {
      setErrors([...tagsErrors]);
      return;
    }
    if (tags.length > 0) {
      dispatch(updateTagAndReloadTag(tags[0]._id, tags[0], token));
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
      <Helmet title="Edit label" />
      <div className="is-flex is-align-items-center px-10 mb-25">
        <a href="/labels-management" className="mr-8 is-flex">
          <ArrowLeftIcon color={black950} size="small" />
        </a>
        <nav className="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li><a href="/labels-management" className="has-text-grey">Label Management</a></li>
            <li className="is-active has-text-weight-semibold"><div className="px-5">Edit Label</div></li>
          </ul>
        </nav>
      </div>
      <div className="is-flex mb-25 is-justify-content-space-between is-align-items-center">
        <div className="is-flex is-flex-wrap-wrap is-align-items-center">
          <p className="has-text-weight-semibold has-text-black-950 is-size-4 mr-10">
            Edit Label
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
            <CheckOnlineIcon size="small" />
            <span className="ml-8">
              Save
            </span>
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
                placeholder="Search by Suggested Snippet"
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="icon is-left">
                <SearchIcon size="small" />
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
