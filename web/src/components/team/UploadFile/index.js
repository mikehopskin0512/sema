import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { PhotoIcon, UploadIcon } from '../../Icons';
import styles from './UploadFile.module.scss';

const UploadFile = ({ onChange }) => {
  const ref = useRef(null);
  const [file, setFile] = useState();
  const [error, setError] = useState(false);

  const handleClick = () => {
    if (ref.current) {
      ref.current.click();
    }
  };

  const handleChange = (e) => {
    const newFile = e.target.files[0];
    if (!newFile) return;

    if (newFile.type !== 'image/jpeg' && newFile.type !== 'image/png') {
      setError(true);
    } else if ((e.target.files[0].size / 1024 / 1024) >= 50) {
      setError(true);
    } else {
      setError(false);
      onChange(newFile);
      setFile(newFile);
    }
  };

  const imageUrl = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return '';
  }, [file]);

  return (
    <div className="is-flex">
      <div
        className={clsx(
          styles.preview,
          'mr-15 border-radius-4px is-flex is-justify-content-center is-align-items-center',
          file ? 'has-background-white' : 'has-background-gray-100',
          error ? styles.error : '',
        )}
      >
        {
          !error && imageUrl ? (
            <img src={imageUrl} alt="" className={clsx('is-rounded border-radius-20px', styles.image)} />
          ) : (
            <PhotoIcon />
          )
        }
      </div>

      <div>
        <input type="file" className={styles.input} ref={ref} onChange={handleChange} />
        <button
          type="button"
          className="button has-background-gray-200 px-20 has-text-weight-semibold is-flex is-small border-radius-4px mb-15"
          onClick={handleClick}
        >
          <UploadIcon className="mr-8" size="small" />
          { file ? 'Change Picture' : 'Upload'}
        </button>
        {
          error && (
            <div className="has-text-error is-size-8">
              Invalid Photo Format.
              <br />
              Try png, jpg less then 50Mb
            </div>
          )
        }
      </div>
    </div>
  );
};

UploadFile.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default UploadFile;
