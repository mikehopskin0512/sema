import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import CustomRadio from '../../radio';

export const initialValues = {
  label: '',
  type: 'language'
}

const LabelForm = ({ onChangeData, id, data, errors }) => {
  const index = useMemo(() => id, []);
  
  return (
    <div className="columns pb-25" style={{ borderBottom: '1px solid #dbdbdb' }}>
      <div className="column">
        <label className="has-text-deep-black">Name</label>
        <input
          name={`input-${index}`}
          className="input has-background-white mt-8"
          type="text"
          value={data.label}
          onChange={(e) => onChangeData('label', e.target.value, index)}
        />
        { errors[index] && errors[index].label && <p className="has-text-danger is-size-7 is-italic">{errors[index].label}</p> }
      </div>
      <div className="column">
        <label className="has-text-deep-black">Category</label>
        <div className="control mt-15 is-flex">
          <CustomRadio
            label="Languages"
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
    </div>
  );
};

export default LabelForm;