import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePortfolioTitle } from '../../../state/features/portfolios/actions';
import { KEY_CODES } from '../../../utils/constants';
import useOutsideClick from '../../../utils/useOutsideClick';
import { EditIcon } from '../../Icons';
import { gray900 } from '../../../../styles/_colors.module.scss';

const TitleField = ({ isEditable, portfolio }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState('');
  const [isInputActive, setIsInputActive] = useState(false);
  const inputRef = useRef(null);

  const update = () => {
    const isTitleChanged = value !== portfolio.title;
    if (isEditable && isTitleChanged) {
      dispatch(updatePortfolioTitle(portfolio._id.toString(), value));
    }
    setIsInputActive(false);
  };
  const onTitleInputKeyDown = (e) => {
    const isEnterKey = e.keyCode === KEY_CODES.ENTER;
    if (isEnterKey) {
      update();
    }
  };
  useOutsideClick(inputRef, update);
  useEffect(() => {
    setValue(portfolio.title);
  }, [portfolio.title]);

  return (
    <div className="is-relative is-flex">
      {isInputActive ? (
        <div ref={inputRef}>
          {/* TODO: add validation here  */}
          <input
            onKeyDown={onTitleInputKeyDown}
            style={{
              padding: '9px 16px',
              color: gray900,
            }}
            className="is-size-4 has-text-gray-900 py-8 px-16 has-text-weight-semi-bold has-background-gray-200 border-none"
            value={value}
            onInput={(e) => setValue(e.target.value)}
            type="text"
          />
        </div>
      ) : (
        <>
          <div className="is-size-4 has-text-weight-semi-bold">
            {value}
          </div>
          <div>
            {isEditable && (
              <EditIcon
                className="is-clickable ml-20 mt-5"
                onClick={() => setIsInputActive(true)}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

TitleField.defaultProps = {
  portfolio: {},
  isEditable: false,
};

TitleField.propTypes = {
  portfolio: PropTypes.object,
  isEditable: PropTypes.bool,
};

export default TitleField;
