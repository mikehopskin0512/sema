import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import slugify from 'slugify';

import Toaster from '../../components/toaster';
import withLayout from '../../components/layout';

import { authOperations } from '../../state/features/auth';

const { createAndJoinOrg } = authOperations;

const JoinOrg = () => {
  const dispatch = useDispatch();
  const { register, watch, handleSubmit, errors } = useForm();

  const [slug, setSlug] = useState('');

  // Import state vars
  const { alerts, auth } = useSelector(
    (state) => ({
      alerts: state.alertsState,
      auth: state.authState,
    }),
  );

  const { showAlert, alertType, alertLabel } = alerts;
  const { token, user: { _id: userId } = {} } = auth;

  const onSubmit = (data) => {
    const org = { ...data };
    dispatch(createAndJoinOrg(userId, org, token));
  };

  const generateSlug = (orgName) => {
    const slugifiedName = slugify(orgName.currentTarget.value || '');
    setSlug(slugifiedName);
  };

  return (
    <>
      <Toaster
        type={alertType}
        message={alertLabel}
        showAlert={showAlert} />
      <section className="hero">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-7-tablet is-7-desktop is-7-widescreen">
                <div className="title-topper mt-70 mb-20" />
                <h1 className="title is-spaced">Create/Join Organization</h1>
                <p className="subtitle is-6">Nulla tincidunt consequat tortor ultricies iaculis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="columns">
                    <div className="column is-7">
                      <div className="field">
                        <label className="label">Organization name</label>
                        <div className="control">
                          <input
                            className={`input ${errors.orgName && 'is-danger'}`}
                            type="text"
                            placeholder="Stark Enterprises"
                            name="orgName"
                            onChange={(orgName) => generateSlug(orgName)}
                            autoComplete="off"
                            ref={register({
                              required: 'Organization name is required',
                              maxLength:
                                { value: 80, message: 'Organization name must be less than 80 characters' },
                            })} />
                        </div>
                        <p className="help is-danger">{errors.orgName && errors.orgName.message}</p>
                      </div>
                      <div className="field">
                        <label className="label">Unique URL</label>
                        <div className="control">
                          <input
                            className={`input ${errors.orgName && 'is-danger'}`}
                            type="text"
                            name="slug"
                            defaultValue={slug}
                            ref={register({
                              pattern: { value: /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/, message: 'URL can\'t contain spaces or special characters' },
                            })} />
                        </div>
                        <p className="help is-danger">{errors.slug && errors.slug.message}</p>
                      </div>
                    </div>
                  </div>
                  <div className="control">
                    <button
                      type="submit"
                      className="button is-primary">Continue
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default withLayout(JoinOrg);
