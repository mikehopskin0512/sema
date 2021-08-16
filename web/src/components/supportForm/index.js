import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { supportOperations } from '../../state/features/support';

const { submitSupportEmail } = supportOperations;

const SupportForm = ({ active, closeForm, type = 'Support' }) => {
  const dispatch = useDispatch();
  const { auth, support } = useSelector((state) => ({
    auth: state.authState,
    support: state.supportState,
  }));

  const { user: { username }, token } = auth;
  const { isSending = false } = support;

  const defaultValues = {
    type,
    title: '',
    message: '',
    email: username,
  };

  const {
    register, handleSubmit, formState, reset, setValue,
  } = useForm({ defaultValues });
  const { errors } = formState;

  const close = () => {
    reset();
    setValue('type', type);
    closeForm();
  };

  const onSubmit = async (data) => {
    const { email = username } = data;
    const params = {
      ...data,
      email,
    };
    const response = await dispatch(submitSupportEmail(params, token));
    const { status } = response;
    if (status === 201) {
      close();
    }
  };

  useEffect(() => {
    setValue('type', type);
  }, [setValue, type]);

  return (
    <>
      <div className={clsx('modal', active ? 'is-active' : '')}>
        <div className="modal-background" />
        <div className="modal-content p-50">
          <div className="has-background-white p-50">
            <button className="modal-close is-large" aria-label="close" type="button" onClick={close} />
            <p className="is-size-4 has-text-weight-semibold is-size-3-mobile">We’d love to hear from you!</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="field mt-20">
                <label className="label" htmlFor="title">
                  <p className="is-size-7 is-size-5-mobile">Title</p>
                  <div className="control mt-10">
                    <input
                      className={`input is-size-7 is-size-5-mobile ${errors.title && 'is-danger'}`}
                      type="text"
                      id="title"
                      {
                        ...register('title',
                          {
                            required: 'Title is required',
                          })
                      }
                    />
                    <p className="help is-danger">{errors.title && errors.title.message}</p>
                  </div>
                </label>
              </div>
              <div className="field mt-20">
                <label className="label" htmlFor="type">
                  <p className="is-size-7 is-size-5-mobile">Type</p>
                  <div className="control mt-10">
                    <div className="select is-fullwidth is-size-7 is-size-5-mobile">
                      <select
                        {
                          ...register('type',
                            {
                              required: 'Type is required',
                            })
                        }
                      >
                        <option className="is-size-7 is-size-5-mobile" value="Support">Support</option>
                        <option className="is-size-7 is-size-5-mobile" value="Feedback"> Feedback</option>
                        <option className="is-size-7 is-size-5-mobile" value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </label>
              </div>
              <div className="field mt-20">
                <label className="label" htmlFor="message">
                  <p className="is-size-7 is-size-5-mobile">Additional Detail</p>
                  <div className="control mt-10">
                    <textarea
                      className="textarea is-size-7 is-size-5-mobile"
                      id="message"
                      placeholder="Optional"
                      {...register('message')}
                    />
                  </div>
                </label>
              </div>
              <div className="field mt-5">
                <label className="label" htmlFor="email">
                  <p className="is-size-7 is-size-5-mobile">Email</p>
                  <div className="control mt-10">
                    <input
                      className={`input is-size-7 is-size-5-mobile ${errors.email && 'is-danger'}`}
                      id="email"
                      type="email"
                      {
                        ...register('email',
                          {
                            required: 'Email is required',
                            pattern: {
                              value: /\S+@\S+\.\S+/,
                              message: 'Entered value does not match email format',
                            },
                          })
                      }
                    />
                    <p className="help is-danger">{errors.email && errors.email.message}</p>
                  </div>
                </label>
              </div>
              <div className="field is-grouped mt-25 is-flex is-justify-content-center">
                <div className="control">
                  <button className={`button is-link ${isSending ? 'is-loading' : ''}`} type="submit">Submit</button>
                </div>
                <div className="control">
                  <button onClick={close} className="button is-link is-light" type="button">Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

SupportForm.defaultProps = {
  type: 'Support',
};

SupportForm.propTypes = {
  active: PropTypes.bool.isRequired,
  closeForm: PropTypes.func.isRequired,
  type: PropTypes.string,
};

export default SupportForm;
