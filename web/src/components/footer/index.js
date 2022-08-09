import clsx from 'clsx';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon, SemaIcon, DiscordIcon } from '../Icons';
import styles from './footer.module.scss';
import ContactUs from '../contactUs';
import SupportForm from '../supportForm';
import { noContactUs, PATHS } from '../../utils/constants';
import { black900, gray600, white0 } from '../../../styles/_colors.module.scss';

const Footer = () => {
  const router = useRouter();
  const { pathname } = router;
  const isCollabarationPage = pathname.includes('collaboration');
  const isNegativeColors = pathname.includes('collaboration');
  const isDiscordIconNeeded = isCollabarationPage || pathname.includes('/login');
  const auth = useSelector((state) => state.authState);
  const { userVoiceToken, isAuthenticated } = auth;
  const [dashboardLink] = useState('https://app.semasoftware.com');
  const [termsAndConditionsLink] = useState('https://www.semasoftware.com/legal/terms-conditions');
  const [userVoiceLink] = useState('https://sema.uservoice.com/forums/934797-sema ');
  const [socialLinks] = useState({
    linkedIn: 'https://www.linkedin.com/company/11298026',
    instagram: 'https://www.instagram.com/se_ma1743/',
    facebook: 'https://business.facebook.com/semasoftware/',
    twitter: 'https://twitter.com/semasoftware1',
    discord: 'https://discord.com/invite/7pbCBWvRNq',
  });
  const [supportForm, setSupportForm] = useState(false);
  const [formType, setFormType] = useState(null);

  const openSupportForm = (type) => {
    setSupportForm(true);
    setFormType(type);
  };
  const closeSupportForm = () => setSupportForm(false);

  const renderSocialLinks = () => (
    <div className={`is-flex is-align-items-center is-justify-content-space-evenly ${styles['social-icon-wrapper']}`}>
      <a className='is-flex' href={socialLinks.linkedIn} target="_blank" rel="noreferrer">
        <LinkedinIcon color={isNegativeColors ? white0 : black900} size="small" />
      </a>
      <a className='is-flex' href={socialLinks.facebook} target="_blank" rel="noreferrer">
        <FacebookIcon color={isNegativeColors ? white0 : black900} size="small" />
      </a>
      <a className='is-flex' href={socialLinks.twitter} target="_blank" rel="noreferrer">
        <TwitterIcon color={isNegativeColors ? white0 : black900} size="small" />
      </a>
      { isDiscordIconNeeded && <a className='is-flex' href={socialLinks.discord} target="_blank" rel="noreferrer">
        <DiscordIcon color={isNegativeColors ? white0 : black900} size="small" />
      </a>}
    </div>
  );

  const renderAppLinks = () => (
    <>
      <div className="has-text-centered mx-20">
        <a className={`button is-ghost ${isNegativeColors ? 'has-text-white-50' : 'has-text-black-900'} is-size-7 has-text-weight-semibold px-10`} href={termsAndConditionsLink}>Terms & Conditions</a>
      </div>
      <div className="has-text-centered mx-20">
        <div
          className={`button is-ghost ${isNegativeColors? 'has-text-white-50' : 'has-text-black-900'} is-size-7 is-size-m-desktop has-text-weight-semibold px-10`}
          onClick={() => openSupportForm('Feedback')}
          aria-hidden="true"
        >
          Send Feedback
        </div>
      </div>
      {isAuthenticated && !isCollabarationPage && (
        <div className="has-text-centered">
          <a className="button is-ghost has-text-black-900 is-size-7 has-text-weight-semibold px-10" href={`https://sema.uservoice.com/?sso=${userVoiceToken}`}>Idea Board</a>
        </div>
      )}
      {/** ToDo: return support when it'll start working*/}
      {/* <div className="has-text-centered">
        <a className="button is-ghost has-text-black-900 is-size-7 has-text-weight-semibold px-10" href={PATHS.SUPPORT}>Support</a>
      </div> */}
    </>
  );

  const renderContactUs = () => {
    if (noContactUs.includes(pathname)) {
      return;
    }
    return <ContactUs userVoiceToken={userVoiceToken} openSupportForm={() => openSupportForm('Support')} />
  }

  return (
    <>
      {!isCollabarationPage && renderContactUs()}
      <footer className={clsx(styles.footer, 'px-80', isNegativeColors ? 'has-background-black is-full-width' : '')}>
        <div className='content-container is-flex is-justify-content-center p-0 is-full-width'>
          <SupportForm active={supportForm} closeForm={closeSupportForm} type={formType} />
          <div className={clsx("is-relative is-flex is-flex-wrap-wrap is-align-items-center is-justify-content-flex-start is-full-width", styles['responsive-footer'])}>
            <div className="is-flex is-align-items-center is-justify-content-space-between is-full-width">
              <div className={`${isNegativeColors ? 'has-text-white-50' : 'has-text-gray-600'} is-size-7 has-text-centered is-hidden-touch is-flex is-align-items-center`}>
                <SemaIcon color={isNegativeColors ? white0 : gray600} size="medium" className="mr-8" /> Copyright &copy; {new Date().getFullYear()} Sema Technologies, Inc. All rights reserved.
              </div>
              <div className={clsx("is-flex is-align-items-center", styles['social-container'])}>
                {renderAppLinks()}
                {renderSocialLinks()}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
