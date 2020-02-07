import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import withLayout from '../components/layout';
import "./login/styles.scss";

const Login = () => (
  <section className="hero is-primary">
    <div className="hero-body">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-5-tablet is-4-desktop is-4-widescreen">
            <div style={{padding: '1.25rem'}}><p>Sema</p><p className="is-size-4 has-text-white">Code Quality Platform</p></div>

            <form action="" className="box">
              <div className="field">
                <label for="" className="label">Email</label>
                <div className="control has-icons-left">
                  <input type="email" placeholder="e.g. tony@starkindustries.com" className="input" required />
                  <span className="icon is-small is-left">
                    <FontAwesomeIcon icon="envelope" />
                  </span>
                </div>
              </div>
              <div className="field">
                <label for="" className="label">Password</label>
                <div className="control has-icons-left">
                  <input type="password" placeholder="*******" className="input" required />
                  <span className="icon is-small is-left">
                    <FontAwesomeIcon icon="lock" />
                  </span>
                </div>
              </div>
              <div className="field">
                <Link href="#"><a className="is-size-7">Forgot password?</a></Link>
              </div>
              <div className="field">
                <button className="button is-primary is-fullwidth">
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

export default withLayout(Login);
