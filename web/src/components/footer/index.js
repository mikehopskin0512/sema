import clsx from 'clsx';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedinIn, faInstagram, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import styles from './footer.module.scss';
import ContactUs from '../contactUs';
import SupportForm from '../supportForm';

const Footer = () => {
  const auth = useSelector((state) => state.authState);
  const { userVoiceToken } = auth;
  const [dashboardLink] = useState('https://app.semasoftware.com');
  const [termsAndConditionsLink] = useState('https://semasoftware.com/terms-and-conditions');
  const [userVoiceLink] = useState('https://sema.uservoice.com/forums/934797-sema ');
  const [socialLinks] = useState({
    linkedIn: 'https://www.linkedin.com/company/11298026',
    instagram: 'https://www.instagram.com/se_ma1743/',
    facebook: 'https://business.facebook.com/semasoftware/',
    twitter: 'https://twitter.com/semasoftware1',
  });
  const [supportForm, setSupportForm] = useState(false);
  const [formType, setFormType] = useState(null);

  const openSupportForm = (type) => {
    setSupportForm(true);
    setFormType(type);
  };
  const closeSupportForm = () => setSupportForm(false);

  const renderSocialLinks = () => (
    <div className="is-flex is-align-items-center is-justify-content-center">
      <div className="mx-15">
        <a href={socialLinks.linkedIn} target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faLinkedinIn} color="white" size="lg" />
        </a>
      </div>
      <div className="mx-15">
        <a href={socialLinks.instagram} target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faInstagram} color="white" size="lg" />
        </a>
      </div>
      <div className="mx-15">
        <a href={socialLinks.facebook} target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faFacebook} color="white" size="lg" />
        </a>
      </div>
      <div className="mx-15">
        <a href={socialLinks.twitter} target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faTwitter} color="white" size="lg" />
        </a>
      </div>
    </div>
  );

  const renderAppLinks = () => (
    <>
      <div className="has-text-white has-text-centered is-hidden-mobile">
        &copy; {new Date().getFullYear()} Sema
      </div>
      <div className="has-text-centered">
        <a className="button is-ghost has-text-white has-text-weight-semibold" href={termsAndConditionsLink}>Terms & Conditions</a>
      </div>
      <div className="has-text-centered">
        <div
          className="button is-ghost has-text-white is-size-m-desktop has-text-weight-semibold"
          onClick={() => openSupportForm('Support')}
          aria-hidden="true"
        >
          Support
        </div>
      </div>
      <div className="has-text-centered">
        <div
          className="button is-ghost has-text-white is-size-m-desktop has-text-weight-semibold"
          onClick={() => openSupportForm('Feedback')}
          aria-hidden="true"
        >
          Feedback
        </div>
      </div>
      <div className="has-text-centered">
        <a className="button is-ghost has-text-white has-text-weight-semibold" href={userVoiceLink}>Idea Board</a>
      </div>
      <div className="is-one-quarter-fullhd is-1-desktop" />
    </>
  );

  return (
    <>
      <ContactUs userVoiceToken={userVoiceToken} openSupportForm={openSupportForm} />
      <footer className={clsx(styles.footer, 'px-50')}>
        <SupportForm active={supportForm} closeForm={closeSupportForm} type={formType} />
        <div className="is-flex is-flex-wrap-wrap is-flex-direction-column is-align-items-center is-hidden-desktop">
          {renderAppLinks()}
        </div>
        <div className="is-flex is-justify-content-space-between is-align-items-center is-hidden-mobile">
          <div className="is-flex is-flex-wrap-wrap is-align-items-center ">
            {renderAppLinks()}
          </div>
          <div>
            {renderSocialLinks()}
          </div>
        </div>
        <div className="is-hidden-desktop mt-25">
          {renderSocialLinks()}
        </div>
        <div className="has-text-white has-text-centered is-hidden-desktop my-25">
          &copy; {new Date().getFullYear()} Sema
        </div>
      </footer>
    </>
  );
};

export default Footer;
