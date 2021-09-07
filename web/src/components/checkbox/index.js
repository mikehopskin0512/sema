import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faMinus } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import styles from './checkbox.module.scss';

const Checkbox = ({ value, onChange, intermediate }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    onChange(!value);
  };

  return (
    <div
      className={clsx(`is-flex is-align-items-center is-justify-content-center ${
        intermediate || value ? 'has-background-primary border-none' : 'has-background-white'}`, styles.wrapper)}
      onClick={handleClick}
    >
      {
        intermediate ? (<FontAwesomeIcon icon={faMinus} size="xs" color="#fff" />) : (
          <>
            {
              value && <FontAwesomeIcon icon={faCheck} size="xs" color="#fff" />
            }
          </>
        )
      }
    </div>
  );
};

Checkbox.propTypes = {
  value: PropTypes.bool,
  onChange: PropTypes.func,
  intermediate: PropTypes.bool,
};

Checkbox.defaultProps = {
  value: false,
  onChange: () => {},
  intermediate: false,
};
export default Checkbox;
