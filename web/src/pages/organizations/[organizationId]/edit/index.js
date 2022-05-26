import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import toaster from 'toasted-notes';
import { InputField } from 'adonis';
import clsx from 'clsx';
import _ from 'lodash';
import checkAvailableUrl from '../../../../utils/checkAvailableUrl';
import Helmet, { OrganizationUpdateHelmet } from '../../../../components/utils/Helmet';
import withLayout from '../../../../components/layout';
import { organizationsOperations } from '../../../../state/features/organizations[new]';
import { ArrowLeftIcon, CheckFilledIcon, CheckOnlineIcon, CloseIcon, InviteIcon, LoadingBlueIcon, AlertOutlineIcon } from '../../../../components/Icons';
import { PATHS, SEMA_CORPORATE_ORGANIZATION_NAME } from '../../../../utils/constants' ;
import withSelectedOrganization from '../../../../components/auth/withSelectedOrganization';
import UploadFile from '../../../../components/organization/UploadFile';
import { uploadOrganizationAvatar } from "../../../../state/features/organizations[new]/actions";
import styles from './organizationEdit.module.scss';

const { editOrganization, fetchOrganizationsOfUser } = organizationsOperations;

function OrganizationEditPage() {
  const {
    query: { organizationId },
  } = useRouter();
  const [organization, setOrganization] = useState({
    name: '',
    description: '',
    members: '',
    avatarUrl: '',
    url: null,
  });
  const [errors, setErrors] = useState({
    name: null,
    url: null,
    avatarUrl: null,
  });
  const URL_STATUS = {
    ALLOCATED: 'allocated',
    AVAILABLE: 'available',
  };
  // eslint-disable-next-line no-unused-vars
  const [userRole, setUserRole] = useState({})
  const [isUrlCheckLoading, setUrlCheckLoading] = useState(false);
  const [urlChecks, setUrlChecks] = useState({
    [SEMA_CORPORATE_ORGANIZATION_NAME]: URL_STATUS.ALLOCATED,
    urlChecked: false,
  });
  const [originalOrganizationUrl, setOriginalOrganizationUrl] = useState(null);
  const isAllocatedUrl = urlChecks[organization.url] === URL_STATUS.ALLOCATED;
  const isAvailableUrl = urlChecks[organization.url] === URL_STATUS.AVAILABLE;
  const router = useRouter();
  const dispatch = useDispatch();

  const { auth, organizations } = useSelector(
    (state) => ({
      auth: state.authState,
      organizations: state.organizationsNewState
    }),
  );
  const { token } = auth

  useEffect(() => {
    if (organizations.organizations.length) {
      const activeRole = _.find(organizations.organizations, (o) => o.organization?._id === organizationId);
      const activeOrganization = {
        _id: organizationId,
        name: activeRole?.organization?.name,
        description: activeRole?.organization?.description,
        avatarUrl: activeRole?.organization?.avatarUrl,
        url: activeRole?.organization?.url,
      }
      if (activeRole) {
        setUserRole(activeRole)
        setOrganization(activeOrganization)
        setOriginalOrganizationUrl(activeOrganization.url);
      }
    }
  }, [organizations]);

  useEffect(() => {
    dispatch(fetchOrganizationsOfUser(token));
  }, []);

  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    dispatch(uploadOrganizationAvatar(organizationId, formData, token));
  };

  const mutate = (obj) => {
    setOrganization({
      ...organization,
      ...obj,
    });
  };

  const checkUrl = async (e) => {
    e?.preventDefault();
    setUrlCheckLoading(true);
    try {
      const data = await checkAvailableUrl(organization.url, token);
      setUrlChecks((state) => ({
        ...state,
        [organization.url]: data.isAvailable ? URL_STATUS.AVAILABLE : URL_STATUS.ALLOCATED,
        urlChecked: true,
      }));
      return data.isAvailable;
    } catch (error) {
      return setErrors({
        ...errors,
        url: 'URL is required',
      });
    } finally {
      setUrlCheckLoading(false);
    }
  };

  const onUpdate = async () => {
    const isUrlChanged = organization.url && originalOrganizationUrl !== organization.url;
    if (isUrlChanged) {
      if (!urlChecks.urlChecked) {
        const isUrlAvailable = !urlChecks[organization.url] && (await checkUrl());
        if (!isUrlAvailable) {
          return;
        }
      }
    }
    if (!organization.name || !organization.url) {
      setErrors({
        name: !organization.name ? 'Organization name is required' : null,
        url: !organization.url ? 'URL is required' : null,
      });
      return;
    }

    const { avatarUrl, ...organizationData } = organization;

    if (avatarUrl) {
      await uploadAvatar(avatarUrl);
    }

    await dispatch(editOrganization(organizationData, token));

    toaster.notify(({ onClose }) => (
      <div className="message is-success shadow mt-60">
        <div className="message-body has-background-white is-flex">
          <CheckFilledIcon size="small" />
          <div>
            <div className="is-flex is-justify-content-space-between mb-15">
              <span className="is-line-height-1 has-text-weight-semibold has-text-black ml-8">Organization Updated</span>
              <div onClick={onClose}>
                <CloseIcon size="small" />
              </div>
            </div>
            <div className="has-text-black">
              You’ve successfully updated the organization
            </div>
            <div>
              <span className="has-text-black has-text-weight-semibold">{ organization.name }.</span>
              <a href={`${PATHS.ORGANIZATIONS._}/${organizationId}${PATHS.SETTINGS}`} className="has-text-primary ml-10" aria-hidden="true">Go to the organization page</a>
            </div>
          </div>
        </div>
      </div>
    ), {
      position: 'top-right',
      duration: 4000,
    });

    mutate(organization);
    await router.push(`${PATHS.ORGANIZATIONS._}/${organizationId}${PATHS.SETTINGS}`);
  };

  const onCancel = async () => {
    await router.back();
  };

  return (
    <div className="has-background-gray-200 hero">
      <Helmet {...OrganizationUpdateHelmet} />
      <div className="hero-body pb-100">
        <div className="is-flex is-align-items-center px-30 mb-40">
          <a href={PATHS.ORGANIZATIONS.SETTINGS(organizationId)} className="has-text-black-950 is-flex is-align-items-center">
            <ArrowLeftIcon />
            <span className="ml-10 has-text-gray-600">Organization Management</span>
          </a>
          <div className="has-text-black-950 mx-5">/</div>
          <div className="has-text-black-950 mr-5">Edit Organization Profile</div>
          <InviteIcon size="small" />
        </div>

        <div className="is-flex px-10 mb-25 is-justify-content-space-between is-align-items-center">
          <div className="is-flex is-flex-wrap-wrap is-align-items-center">
            <p className="has-text-weight-semibold has-text-black-950 is-size-4 mr-10">
              Edit Organization Profile
            </p>
          </div>
          <div className="is-flex">
            <button
              className="button is-small is-outlined is-primary has-background-white has-text-primary border-radius-4px mr-10"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="button is-small is-primary border-radius-4px"
              type="button"
              onClick={onUpdate}
            >
              <CheckOnlineIcon size="small" />
              <span className="ml-8">
                Save
              </span>
            </button>
          </div>
        </div>
        <div className="px-10">
          <div className="mb-15">
            <span className="label is-size-6">
              Organization Name <span className="has-text-error">*</span>
            </span>
            <InputField
                id="organization-name"
                isRequired
                value={organization.name}
                onChange={(organizationName) => {
                  mutate({ name: organizationName });
                  setErrors({ ...errors, name: null });
                }}
                error={ errors?.name }
                className='is-flex-grow-1'
              />
          </div>
          <div className="mb-15">
            <span className="label is-size-6">
              Organization URL <span className="has-text-error">*</span>
            </span>
            <div className="is-flex">
              <InputField
                className={`${styles['initial-slug']}`}
                type="text"
                placeholder="app.semasoftware.com/organizations/"
                error={ errors?.url}
                disabled
              />
              <InputField
                isRequired
                value={organization.url}
                onChange={(organizationUrl) => {
                  mutate({ url: organizationUrl });
                  setErrors({ ...errors, url: null });
                }}
                error={ errors?.url }
                className={clsx(
                  'is-flex-grow-1',
                  styles.slug,
                  errors?.url && styles['url-error']
                )}
              />
              <button className="ml-16 button"
                onClick={checkUrl}
                disabled={originalOrganizationUrl === organization.url}
              >
                <div
                  className={clsx(
                    'is-flex is-align-items-center',
                    (isAllocatedUrl || errors?.url) &&
                      'has-text-red-500',
                    isAvailableUrl && 'has-text-green-500'
                  )}
                >
                  {isUrlCheckLoading ? (
                    <LoadingBlueIcon className="mr-8" size="small" />
                  ) : (
                    ((isAllocatedUrl || errors?.url) && (
                      <AlertOutlineIcon className="mr-8" size="small" />
                    )) ||
                    (isAvailableUrl && (
                      <CheckOnlineIcon className="mr-8" size="small" />
                    ))
                  )}
                  <span className="has-text-weight-semibold">Check</span>
                </div>
              </button>
            </div>
          </div>
          <div className="mb-15">
            <span className="label is-size-6">
              Description
            </span>
            <textarea
              className="textarea has-background-white mb-10"
              placeholder="Description"
              value={organization.description}
              onChange={(e) => {
                mutate({ description: e.target.value });
              }}
              required
            />
          </div>
          <div className="mb-15">
            <span className="label is-size-6">
              Profile Picture
            </span>
            <UploadFile
              onChange={(file) => {
                mutate({ avatarUrl: file });
                setErrors({ ...errors, avatarUrl: null });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withSelectedOrganization(withLayout(OrganizationEditPage));
