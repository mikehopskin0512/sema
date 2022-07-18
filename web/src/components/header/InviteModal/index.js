import React, { useCallback, useRef, useState } from 'react';
import clsx from 'clsx';
import styles from '../header.module.scss';
import PropTypes from 'prop-types';
import { CheckOnlineIcon, CloseIcon } from '../../../components/Icons';
import { black900, blue700 } from '../../../../styles/_colors.module.scss';
import TagInput from '../../../components/inputs/tagsInput';
import { notify } from '../../../components/toaster/index';
import useOutsideClick from '../../../utils/useOutsideClick';

export const InviteModal = ({
  isActive,
  onClose,
  onSubmit,
}) => {
  const modalRef = useRef(null);
  const [emails, setEmails] = useState([]);
  const [isSuccessScreen, setSuccessScreen] = useState(false);

  const sendInvites = useCallback(async () => {
    if (!emails.length) return;
    if (emails.some(i => !/(.+)@(.+){2,}\.(.+){2,}/.test(i))) {
      notify('Invalid email format')
      return;
    }

    let invites = 0;
    await Promise.all(emails.map(async (email) => {
      const success = await onSubmit(email);
      if (!success) {
        return notify(`Failed to send email to ${email} `, { type: 'error' });
      } else {
        invites++;
      }
    }))
      .then(() => {
        if (emails.length === invites) {
          setSuccessScreen(true);
        }
      });
  }, [emails]);

  const closePopup = () => {
    onClose();
    setSuccessScreen(false);
    setEmails([]);
  };

  useOutsideClick(modalRef, closePopup);

  return (
    <div className={clsx('modal', isActive ? 'is-active' : '', styles['invite-modal'])}>
      <div className='modal-background' />
      <div className={clsx('modal-content px-10', styles['invite-modal-content'])} ref={modalRef}>
        <div className='has-background-white p-40 border-radius-8px'>
          <h3 className={styles['invite-modal-title']}>{isSuccessScreen ? 'Invitation(s) Sent' : 'Recommend a Friend'}</h3>
          <div onClick={closePopup} className={clsx('is-clickable', styles['close-button'])}>
            <CloseIcon size='medium' color={black900} />
          </div>
          {isSuccessScreen ? (
            <div className='is-flex is-align-items-center'>
              <div className={styles['tick-wrapper']}>
                <CheckOnlineIcon color={blue700} />
              </div>
              <span className={styles['success-screen-text']}>We successfully sent your invitation.</span>
            </div>
          ) : (
            <>
              <TagInput
                tagData={emails}
                setTagData={setEmails}
                label='Enter Email(s)'
                placeholder='Press enter to add email'
                errorText='Invalid email format'
                validation={/(.+)@(.+){2,}\.(.+){2,}/}
              />
              <div className='is-flex is-justify-content-flex-end mt-24'>
                <button className='button is-outlined font-weight-600 mr-16' aria-haspopup='true' aria-controls='dropdown-menu2' onClick={closePopup}>
                  Cancel
                </button>
                <button className='button is-primary font-weight-600' aria-haspopup='true' aria-controls='dropdown-menu2' onClick={sendInvites}
                        disabled={!Boolean(emails.length)}>
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

InviteModal.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
