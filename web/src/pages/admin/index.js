import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import Toaster from '../../components/toaster';
import withLayout from '../../components/layout';

import { invitationsOperations } from '../../state/features/invitations';
import { alertOperations } from '../../state/features/alerts';

const { createInvite } = invitationsOperations;
const { clearAlert } = alertOperations;

const Admin = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, errors, reset } = useForm();

  // Import state vars
  const { alerts, auth } = useSelector(
    (state) => ({
      alerts: state.alertsState,
      auth: state.authState,
    }),
  );

  const { showAlert, alertType, alertLabel } = alerts;
  const { token, user } = auth;
  const { _id: userId, firstName, lastName, organizations = [] } = user;
  const fullName = `${firstName} ${lastName}`;
  const [currentOrg = {}] = organizations;
  const { id: orgId, orgName } = currentOrg;

  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  const onSubmit = async (data) => {
    const { email } = data;

    // Build invitation data
    const invitation = {
      recipient: email,
      orgId,
      orgName,
      sender: userId,
      senderName: fullName,
    };

    // Send invite & reset form
    await dispatch(createInvite(invitation, token));
    reset();
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
                <h1 className="title is-spaced">Admin panel</h1>
                <p className="subtitle is-6">Enter an email address below to invite a colleague to the platfrom. They will be automatically added to your organization when they join.</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="columns">
                    <div className="column is-7">
                      <div className="field">
                        <label className="label">Email</label>
                        <div className="control">
                          <input
                            className={`input ${errors.email && 'is-danger'}`}
                            type="email"
                            placeholder="tony@starkindustries.com"
                            name="email"
                            ref={register({
                              required: 'Email is required',
                              pattern:
                                { value: /^\S+@\S+$/i, message: 'Invaild email format' },
                            })} />
                        </div>
                        <p className="help is-danger">{errors.email && errors.email.message}</p>
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

export default withLayout(Admin);
