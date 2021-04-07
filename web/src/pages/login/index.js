import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';

import Toaster from '../../components/toaster';
import withLayout from '../../components/layout';
import styles from './login.module.scss';

import { alertOperations } from '../../state/features/alerts';
import { authOperations } from '../../state/features/auth';
import clsx from 'clsx';

const { clearAlert } = alertOperations;
const { authenticate } = authOperations;

const Login = () => {
    const dispatch = useDispatch();
    const { register, handleSubmit, watch, errors } = useForm();

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

    const onSubmit = (data) => {
        const { email, password } = data;
        dispatch(authenticate(email, password));
    };
    console.log(styles)
    return (
        <div className={styles["css-container"]}>
            <Toaster
                type={alertType}
                message={alertLabel}
                showAlert={showAlert} />
            <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <div class="tile is-ancestor">
                            <div class="tile is-6" />
                            <div className={clsx("tile is-child is-5 box", styles["tile-padding"])}>
                                <h1 class="title has-text-centered">Welcome to Sema</h1>
                                <h2 class="subtitle has-text-centered is-size-6">Sema is still a work in progress. Join the waitlist to be amongst the first to try it out.</h2>
                                <a
                                    type="button"
                                    className="button is-black is-fullwidth"
                                    href="/api/identities/github">
                                    <span>Join the waitlist with Github</span>
                                </a>
                                {/* <button class="button is-black is-fullwidth" href="/api/identities/github">Join the waitlist with Github</button> */}
                                <p className={styles["through-container"]}>
                                    <span className={styles.line} />
                                    <span className={styles["text-container"]}>
                                        <span className={styles["through-text"]}>Already have an account?</span>
                                    </span>
                                </p>
                                <a
                                    type="button"
                                    className="button is-fullwidth"
                                    href="/api/identities/github">
                                    <span>Sign in with Github</span>
                                </a>
                                {/* <button class="button is-fullwidth">Sign in with Github</button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default withLayout(Login);
