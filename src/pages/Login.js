import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';

import withLayout from '../components/layout';
import './login/styles.scss';

import { authOperations } from '../modules/auth';

const { login } = authOperations;

const Login = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, watch, errors } = useForm();

  const onSubmit = (data) => {
    const { email, password } = data;
    dispatch(login(email, password));
  };

  return (
    <section className="hero is-primary">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-5-tablet is-4-desktop is-4-widescreen">
              <div style={{ padding: '1.25rem' }}><p>Sema</p><p className="is-size-4 has-text-white">Code Quality Platform</p></div>

              <form className="box" onSubmit={handleSubmit(onSubmit)}>
                <div className="field">
                  <label htmlFor="" className="label">Email</label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="email"
                      placeholder="e.g. tony@starkindustries.com"
                      name="email"
                      ref={register}
                      required
                    />
                    <span className="icon is-small is-left">
                      <FontAwesomeIcon icon="envelope" />
                    </span>
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="" className="label">Password</label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="password"
                      placeholder="*******"
                      name="password"
                      ref={register}
                      required
                    />
                    <span className="icon is-small is-left">
                      <FontAwesomeIcon icon="lock" />
                    </span>
                  </div>
                </div>
                <div className="field">
                  <Link href="#"><a className="is-size-7">Forgot password?</a></Link>
                </div>
                <div className="field">
                  <button type="button" className="button is-primary is-fullwidth">
                    Login
                  </button>
                </div>
                <div className="field">
                  <p className="has-text-centered is-size-7">
                    By signing in, you agree to our<br />Terms and Conditions
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default withLayout(Login);
