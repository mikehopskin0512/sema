import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const SupportForm = ({ active, closeForm }) => (
  <div className={clsx('modal', active ? 'is-active' : '')}>
    <div className="modal-background" />
    <div className="modal-content p-50">
      <div className="has-background-white p-50">
        <button className="modal-close is-large" aria-label="close" type="button" onClick={closeForm} />
        <p className="is-size-4 has-text-weight-semibold is-size-3-mobile">Let us know what you think!</p>
        <form>
          <div className="field mt-20">
            <label className="label" htmlFor="title">
              <p className="is-size-7 is-size-5-mobile">Title</p>
              <div className="control mt-10">
                <input className="input is-size-7 is-size-5-mobile" type="text" id="title" />
              </div>
            </label>
          </div>
          <div className="field mt-20">
            <label className="label" htmlFor="subject">
              <p className="is-size-7 is-size-5-mobile">Type</p>
              <div className="control mt-10">
                <div className="select is-fullwidth is-size-7 is-size-5-mobile">
                  <select>
                    <option className="is-size-7 is-size-5-mobile" value="Support">Support</option>
                    <option className="is-size-7 is-size-5-mobile" value="Feedback"> Feedback</option>
                    <option className="is-size-7 is-size-5-mobile" value="Other">Other</option>
                  </select>
                </div>
              </div>
            </label>
          </div>
          <div className="field mt-20">
            <label className="label" htmlFor="message">
              <p className="is-size-7 is-size-5-mobile">Additional Detail</p>
              <div className="control mt-10">
                <textarea className="textarea is-size-7 is-size-5-mobile" id="message" placeholder="Optional" />
              </div>
            </label>
          </div>
          <div className="field mt-20">
            <label className="label" htmlFor="email">
              <p className="is-size-7 is-size-5-mobile">Email</p>
              <div className="control mt-10">
                <input className="input is-size-7 is-size-5-mobile" id="email" type="email" />
              </div>
            </label>
          </div>
          <div className="field mt-20">
            <div className="control">
              <label className="checkbox" htmlFor="sendCopy">
                <p className="is-size-7 is-size-5-mobile">
                  <input type="checkbox" className="mr-8" id="sendCopy" />Send yourself a copy of this message?
                </p>
              </label>
            </div>
          </div>
          <div className="field is-grouped mt-25 is-flex is-justify-content-center">
            <div className="control">
              <button className="button is-link" type="submit">Submit</button>
            </div>
            <div className="control">
              <button onClick={closeForm} className="button is-link is-light" type="button">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
);

SupportForm.propTypes = {
  active: PropTypes.bool.isRequired,
  closeForm: PropTypes.func.isRequired,
};

export default SupportForm;
