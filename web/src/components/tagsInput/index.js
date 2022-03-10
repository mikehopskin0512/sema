import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';

const createOption = (label) => ({
  label,
  value: label,
});

const TagsInput = ({ onChange, value }) => {
  const [inputValue, setInputValue] = useState('');
  const _onChange = () => {
    const options = createOption(inputValue);
    onChange(value ? [...value, options] : [options]);
  };
  const handleKeyDown = (event) => {
    const isCommaKey = event.keyCode === 188;
    const isEnterKey = event.key === 'Enter';
    const isTabKey = event.key === 'Tab';
    if (inputValue && (isCommaKey || isEnterKey || isTabKey)) {
      _onChange();
      setInputValue('');
      event.preventDefault();
    }
  };

  const handleInput = (input) => {
    const isOnBlur = !input && inputValue.length > 1;
    if (isOnBlur) {
      _onChange();
    }
    setInputValue(input);
  };
  return (
    <CreatableSelect
      components={{
        DropdownIndicator: null,
      }}
      inputValue={inputValue}
      isClearable
      isMulti
      menuIsOpen={false}
      onChange={(data) => onChange(data || [])}
      onInputChange={handleInput}
      onKeyDown={handleKeyDown}
      placeholder=" "
      value={value}
    />
  );
};

export default TagsInput;
