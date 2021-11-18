import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

import Toaster from '../../toaster';

import { alertOperations } from '../../../state/features/alerts';
import { authOperations } from '../../../state/features/auth';

const EditModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const [usernames, setUsernames] = useState([]);
  const { alerts, auth } = useSelector((state) => ({
    alerts: state.alertsState,
    auth: state.authState,
  }));

  const { triggerAlert, clearAlert } = alertOperations;
  const { updateUser } = authOperations;

  const { showAlert, alertType, alertLabel } = alerts;
  const { user, token } = auth;
  const { firstName, lastName, username, identities } = user;

  const {
    register, handleSubmit, formState, reset, setError,
  } = useForm({
    defaultValues: {
      firstName,
      lastName,
      username,
    },
  });

  const { errors } = formState;

  useEffect(() => {
    const { emails = [] } = identities[0];
    setUsernames(emails);
  }, [identities]);

  const onSubmit = async (data) => {
    const response = await dispatch(updateUser({
      ...user,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
    }, token));
    if (response) {
      dispatch(triggerAlert('User information updated!', 'success'));
      dispatch(clearAlert());
      onClose();
      return;
    }
    dispatch(triggerAlert('Sorry! We\'re unable to save your changes.', 'error'));
    dispatch(clearAlert());
  };

  return (
    <div className="modal is-active">
      <Toaster
        type={alertType}
        message={alertLabel}
        showAlert={showAlert}
      />
      <div className="modal-background" />
      <div className="modal-content px-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-50 has-background-white">
            <p className="has-text-black has-text-weight-bold is-size-5 mb-25 px-10">Edit Profile Info</p>
            <div className="is-flex">
              <div className="is-flex-grow-1">
                <div className="field my-10 px-10">
                  <p className="has-text-weight-semibold is-size-7 has-text-gray-500 mb-8">First Name</p>
                  <input
                    className="input has-background-white"
                    {...register('firstName', { required: 'First Name is required.' })}
                    defaultValue={firstName}
                  />
                  {errors.firstName && <p className="is-size-8 has-text-danger">{errors.firstName.message}</p> }
                </div>
              </div>
              <div className="is-flex-grow-1">
                <div className="field my-10 px-10">
                  <p className="has-text-weight-semibold is-size-7 has-text-gray-500 mb-8">Last Name</p>
                  <input
                    className="input has-background-white"
                    {...register('lastName', { required: 'Last Name is required.' })}
                  />
                  {errors.lastName && <p className="is-size-8 has-text-danger">{errors.lastName.message}</p> }
                </div>
              </div>
            </div>
            <div className="is-flex">
              <div className="field is-flex-grow-1 px-10 my-10">
                <p className="has-text-weight-semibold is-size-7 has-text-gray-500 mb-8">Primary Sema Email</p>
                <div className="select is-fullwidth">
                  <select
                    className="has-background-white"
                    {...register('username')}
                  >
                    {usernames.map((item) => <option value={item} selected={item === username ? "selected" : undefined}>{item}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="is-flex my-20">
              <div className="is-flex-grow-1 px-10">
                <button className="button is-fullwidth" onClick={() => onClose()} type="button">Cancel</button>
              </div>
              <div className="is-flex-grow-1 px-10">
                <button className="button is-primary is-fullwidth" type="submit">Submit</button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <button className="modal-close is-large" aria-label="close" type="button" onClick={() => onClose()} />
    </div>
  );
};

EditModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default EditModal;
