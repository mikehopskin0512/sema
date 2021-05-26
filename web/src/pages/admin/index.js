import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, useFieldArray } from 'react-hook-form';

import Toaster from '../../components/toaster';
import withLayout from '../../components/layout';
import withAdmin from '../../components/auth/withAdmin';

import { invitationsOperations } from '../../state/features/invitations';
import { alertOperations } from '../../state/features/alerts';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const { createInvite } = invitationsOperations;
const { clearAlert } = alertOperations;

const Admin = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, errors, reset, control } = useForm({
    defaultValues: {
      emails: [{}]
    }
  });

  const { fields, append } = useFieldArray({
    control,
    name: "emails"
  });

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
    const { emails } = data;
    const allInvitationsPromises = [];

    // Build invitation data
    if (Array.isArray(emails)) {
      emails.forEach(email => allInvitationsPromises.push(dispatch(createInvite({
        recipient: email.value,
        orgId,
        orgName,
        sender: userId,
        senderName: fullName,
      }, token))));
    }

    // Send invite & reset form
    await Promise.allSettled(allInvitationsPromises);
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
                        {fields.map((data, index) => <div className={`control ${(index > 0) ? "mt-10" : ""}`} key={data.id}>
                          <input
                            className={`input ${errors.emails?.[index]?.value ? 'is-danger' : ""}`}
                            type="email"
                            placeholder="tony@starkindustries.com"
                            name={`emails[${index}].value`}
                            ref={register({
                              required: 'Email is required',
                              pattern:
                                { value:/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, message: 'Invaild email format' },
                            })} />
                        </div>
                        )}
                        <p className="help is-danger">{Array.isArray(errors.emails) && errors.emails?.[errors.emails.length - 1]?.value.message}</p>
                      </div>
                    </div>
                  </div>
                  <div className="control">
                    <button
                      onClick={() => append({})}
                      type="button"
                      className="button is-black is-inverted has-text-weight-semibold">
                      <span className="icon is-small">
                        <FontAwesomeIcon icon={faPlusCircle} />
                      </span>
                      <span>Add another</span>
                    </button>
                  </div>
                  <div className="columns">
                    <div className="control column is-7">
                      <button
                        type="submit"
                        className="button is-black mt-10 is-fullwidth">Continue
                    </button>
                    </div>
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

export default withAdmin(withLayout(Admin));
