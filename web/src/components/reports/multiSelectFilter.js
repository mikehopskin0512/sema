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

  const currentParams = currentFilters[paramName] || [];
  let defaultVals = [];

  if (currentParams.length > 0) {
    defaultVals = _(selectData)
      .keyBy('label')
      .at(currentParams)
      .value();
  }

  // Filter out any blank values
  const filterdSelectData = _.reject(selectData, (item) => item.label === '');

  return (
    <ReactSelect
      isMulti
      hideSelectedOptions
      options={filterdSelectData}
      value={defaultVals}
      placeholder={placeholder}
      onChange={(option) => buildParams(option)} />
  );
};

MultiSelectFilter.propTypes = {
  updateFilters: PropTypes.func.isRequired,
  selectData: PropTypes.array.isRequired,
  currentFilters: PropTypes.object.isRequired,
  paramName: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
};

export default MultiSelectFilter;
