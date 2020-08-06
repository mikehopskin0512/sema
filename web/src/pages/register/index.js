import Router, { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import jwtDecode from 'jwt-decode';

import withLayout from '../../components/layout/newLayout';

import { authOperations } from '../../state/features/auth';

const { setUser } = authOperations;

const Register = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, errors } = useForm();

  const router = useRouter();
  const { token } = router.query;

  console.log(token);
  const { identity } = jwtDecode(token) || {};
  const { id, email, firstName, lastName } = identity;

  const onSubmit = (data) => {
    const user = { ...data };
    dispatch(setUser(user));
    Router.push('/register/password');
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
                  <p className="help is-danger">{errors.email && errors.email.message}</p>
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
                    <span className="is-size-7">
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
  );
};

export default withLayout(Register);
