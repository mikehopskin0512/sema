import PropTypes from 'prop-types';
import _ from 'lodash';
import ReactSelect from 'react-select';

const MultiSelectFilter = (props) => {
  const { updateFilters, selectData, paramName, placeholder } = props;

  const buildParams = (option) => {
    let paramList;
    if (option && option.length > 0) {
      paramList = _.map(option, (item) => `%5B%5D=${encodeURIComponent(item.label)}`).join('&');
    } else {
      // If options are cleared, reset to default param
      paramList = '=all';
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
