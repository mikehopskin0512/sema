import PropTypes from 'prop-types';
import _ from 'lodash';
import ReactSelect from 'react-select';

const MultiSelectFilter = (props) => {
  const {
    updateFilters, selectData, currentFilters,
    paramName, placeholder,
  } = props;

  const buildParams = (option) => {
    const paramList = [];
    if (option && option.length > 0) {
      _.forEach(option, (item) => paramList.push(item.label));
    }
    updateFilters(paramName, paramList);
  };

  return (
    <ReactSelect
      isMulti
      hideSelectedOptions
      options={selectData}
      placeholder={placeholder}
      onChange={(option) => buildParams(option)} />
  );
};

MultiSelectFilter.propTypes = {
  updateFilters: PropTypes.func.isRequired,
  selectData: PropTypes.array.isRequired,
  paramName: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
};

export default MultiSelectFilter;
