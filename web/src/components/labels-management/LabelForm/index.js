import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import CustomRadio from '../../radio';

export const initialValues = {
  label: 'HELLO',
  type: 'language'
}

const LabelForm = ({ onChangeData, id, data }) => {
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
        {/* { errors.tags && errors.tags[index].name && <p className="has-text-danger is-size-7 is-italic">{errors.tags[index].name.message}</p> } */}
      </div>
      <div className="column">
        <label className="has-text-deep-black">Category</label>
        <div className="control mt-15 is-flex">
          <CustomRadio
            label="Languages"
            name={`category-${index}`}
            value="language"
            checked={data.type === 'language'}
          />
          <CustomRadio
            label="Other labels"
            name={`category-${index}`}
            value="other"
            checked={data.type === 'other'} 
          />
        </div>
      </div>
    </div>
  );
};

export default LabelForm;