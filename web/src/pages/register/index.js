import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import jwtDecode from 'jwt-decode';

import Toaster from '../../components/toaster';
import withLayout from '../../components/layout';

import { alertOperations } from '../../state/features/alerts';
import { authOperations } from '../../state/features/auth';

const { clearAlert } = alertOperations;
const { registerUser } = authOperations;

const Register = () => {
  const dispatch = useDispatch();
  const { register, watch, handleSubmit, errors } = useForm();

  const router = useRouter();
  const { token } = router.query;

  // Import state vars
  const { alerts } = useSelector(
    (state) => ({
      alerts: state.alertsState,
    }),
  );

  const { showAlert, alertType, alertLabel } = alerts;

  // Check for updated state in selectedTag
  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  let identity = {};
  if (token) {
    ({ identity } = jwtDecode(token));
  }
  const { email, firstName, lastName } = identity;

  const onSubmit = (data) => {
    const user = { ...data };
    dispatch(registerUser(user));
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
              <div className="column is-5-tablet is-5-desktop is-5-widescreen">
                <div className="title-topper mt-70 mb-20" />
                <h1 className="title is-spaced">Sign Up</h1>
                <p className="subtitle is-6">Nulla tincidunt consequat tortor ultricies iaculis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="field">
                    <label className="label">First name</label>
                    <div className="control">
                      <input
                        className={`input ${errors.firstName && 'is-danger'}`}
                        type="text"
                        placeholder="Tony"
                        name="firstName"
                        defaultValue={firstName}
                        ref={register({
                          required: 'First name is required',
                          maxLength:
                            { value: 80, message: 'First name must be less than 80 characters' },
                        })} />
                    </div>
                    <p className="help is-danger">{errors.firstName && errors.firstName.message}</p>
                  </div>
                  <div className="field">
                    <label className="label">Last name</label>
                    <div className="control">
                      <input
                        className={`input ${errors.lastName && 'is-danger'}`}
                        type="text"
                        placeholder="Stark"
                        name="lastName"
                        defaultValue={lastName}
                        ref={register({
                          required: 'Last name is required',
                          maxLength:
                            { value: 100, message: 'Last name must be less than 80 characters' },
                        })} />
                    </div>
                    <p className="help is-danger">{errors.lastName && errors.lastName.message}</p>
                  </div>
                  <div className="field">
                    <label className="label">Business email</label>
                    <div className="control">
                      <input
                        className={`input ${errors.username && 'is-danger'}`}
                        type="email"
                        placeholder="tony@starkindustries.com"
                        name="username"
                        defaultValue={email}
                        ref={register({
                          required: 'Email is required',
                          pattern:
                            { value: /^\S+@\S+$/i, message: 'Invaild email format' },
                        })} />
                    </div>
                    <p className="help is-danger">{errors.username && errors.username.message}</p>
                  </div>
                  <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                      <input
                        className={`input ${errors.password && 'is-danger'}`}
                        type="password"
                        name="password"
                        ref={register({
                          required: 'Password is required',
                          minLength: { value: 8, message: 'Minimum of 8 characters required' },
                          maxLength: { value: 20, message: 'Maximum of 20 characters allowed' },
                          pattern: { value: /(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*[@$!%*#?&])/, message: 'Must contain 1 letter, 1 number, and 1 special character' },
                        })} />
                    </div>
                    <p className="help is-danger">{errors.password && errors.password.message}</p>
                  </div>
                  <div className="field">
                    <label className="label">Confirm password</label>
                    <div className="control">
                      <input
                        className={`input ${errors.passwordConfirm && 'is-danger'}`}
                        type="password"
                        name="passwordConfirm"
                        ref={register({
                          validate: (value) => {
                            if (value === watch('password')) {
                              return true;
                            }
                            return 'Passwords do not match';
                          },
                        })} />
                    </div>
                    <p className="help is-danger">{errors.passwordConfirm && errors.passwordConfirm.message}</p>
                  </div>
                  <div className="field">
                    <label className="label">Job title</label>
                    <div className="control">
                      <input
                        className={`input ${errors.jobTitle && 'is-danger'}`}
                        type="text"
                        placeholder="Job title"
                        name="jobTitle"
                        ref={register({ required: 'Job title is required' })} />
                    </div>
                    <p className="help is-danger">{errors.jobTitle && errors.jobTitle.message}</p>
                  </div>
                  <div className="field">
                    <label className="label">Company</label>
                    <div className="control">
                      <input
                        className={`input ${errors.company && 'is-danger'}`}
                        type="text"
                        placeholder="Stark Industries"
                        name="company"
                        ref={register({ required: 'Company is required' })} />
                    </div>
                    <p className="help is-danger">{errors.company && errors.company.message}</p>
                  </div>
                  <div className="field">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        name="terms"
                        ref={register({ required: 'You must accept terms' })} />
                      <span className="is-size-6">
                        &nbsp;&nbsp;By selecting the checkbox you are agreeing to the following <a href="#">terms and conditions</a>
                      </span>
                      <p className="help is-danger">{errors.terms && errors.terms.message}</p>
                    </label>
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

export default withLayout(Register);