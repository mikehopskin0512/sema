import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faSave, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import styles from './inlineEdit.module.scss';

const InlineEdit = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState('');

  useEffect(() => {
    if (isEditing) {
      setVal(value);
    }
  }, [value, isEditing, setVal]);

  const onSubmit = () => {
    if (val !== value) {
      onSave(val);
    }

    setIsEditing(false);
  };

  const onClear = () => {
    onSave('');
  };

  return (
    <div className={clsx('is-relative is-flex is-align-items-center pr-40', styles.wrapper)}>
      {
        isEditing ? (
          <div className="is-flex is-align-items-center">
            <input
              className={clsx('input has-background-white', styles.input)}
              value={val}
              onChange={(e) => setVal(e.target.value)}
            />
            <button className="button is-primary mx-5" onClick={onSubmit}>
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button className="button is-danger" onClick={() => setIsEditing(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        ) : (
          <div>
            <div className={styles.value}>{value}</div>
            <div className={clsx('is-absolute', styles.editButton)}>
              <span
                className="icon is-small is-clickable has-text-primary is-4 mr-5"
                onClick={() => setIsEditing(true)}
              >
                <FontAwesomeIcon icon={faPen} />
              </span>
              <span
                className="icon is-small is-clickable has-text-danger is-4"
                onClick={onClear}
              >
                <FontAwesomeIcon icon={faTrash} />
              </span>
            </div>
          </div>
        )
      }
    </div>
  );
};

InlineEdit.propTypes = {
  value: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default InlineEdit;
