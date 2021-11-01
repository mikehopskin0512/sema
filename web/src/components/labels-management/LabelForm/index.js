import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import PropTypes from 'prop-types';
import CustomRadio from '../../radio';

export const initialValues = {
  label: '',
  type: 'language'
}

const LabelForm = ({ onChangeData, id, data, errors, onRemove }) => {
  const index = useMemo(() => id, []);
  
  return (
    <div className="columns" style={{ borderBottom: '1px solid #dbdbdb' }}>
      <div className="column">
        <label className="has-text-deep-black">Label name</label>
        <input
          name={`input-${index}`}
          className="input has-background-white mt-8"
          type="text"
          value={data.label}
          onChange={(e) => onChangeData('label', e.target.value, index)}
        />
        { errors[index] && errors[index].label && <p className="has-text-danger is-size-7 is-italic">{errors[index].label}</p> }
      </div>
      <div className="column is-half">
        <label className="has-text-deep-black">Category</label>
        <div className="control mt-20 is-flex">
          <CustomRadio
            label="Language"
            name={`category-${index}`}
            value="language"
            checked={data.type === 'language'}
            onChange={() => onChangeData('type', 'language', index)}
          />
          <CustomRadio
            label="Other labels"
            name={`category-${index}`}
            value="other"
            checked={data.type !== 'language'} 
            onChange={() => onChangeData('type', 'guide', index)}
          />
        </div>
        { errors[index] && errors[index].type && <p className="has-text-danger is-size-7 is-italic mt-10">{errors[index].type}</p> }
      </div>
      <div className="column is-one-fifth is-flex is-align-items-center is-justify-content-flex-end">
        { id !== 0 && (
          <button className="button is-text" onClick={() => onRemove(id)}>
            <FontAwesomeIcon icon={faTrashAlt} color="#192129" size="lg" />
          </button>
        ) }
      </div>
    </div>
  );
};

LabelForm.propTypes = {
  data: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  onChangeData: PropTypes.func.isRequired,
  errors: PropTypes.array.isRequired,
  onRemove: PropTypes.func.isRequired,
}

export default LabelForm;