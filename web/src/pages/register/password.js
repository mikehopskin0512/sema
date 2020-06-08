import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Router from 'next/router';
import { useForm } from 'react-hook-form';

import withLayout from '../../components/layout/newLayout';

import { authOperations } from '../../state/features/auth';

const { registerUser } = authOperations;

const Register = () => {
  const dispatch = useDispatch();
  const { register, watch, handleSubmit, errors } = useForm();

  // Import Redux vars
  const { auth } = useSelector(
    (state) => ({
      auth: state.authState,
    }),
  );

  // Get user from Redux
  const { user = {} } = auth;

  // Redirect to register page if no user object
  useEffect(() => {
    if (Object.keys(user).length === 0) { Router.push('/register'); }
  }, [user]);

  const onSubmit = (data) => {
    const { password } = data;
    const newUser = { ...user, password };
    console.log(newUser);
    dispatch(registerUser(newUser));
  };

  return (
    <section className="hero has-background-grey-lighter">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-5-tablet is-5-desktop is-5-widescreen">
              <h3 className="title is-3 is-spaced"><strong>Email Sign Up</strong></h3>
              <p className="subtitle is-6">Nulla tincidunt consequat tortor ultricies iaculis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus sed sapien quis sapien ultrices rhoncus.</p>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="field">
                  <label className="label">Password</label>
                  <div className="control">
                    <input
                      className={`input ${errors.password && 'is-danger'}`}
                      type="password"
                      name="password"
                      ref={register({
                        required: 'Password is required',

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
  );
};

export default withLayout(Register);
