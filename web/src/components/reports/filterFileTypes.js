import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import ReactSelect from 'react-select';

import { organizationsOperations } from '../../state/features/organizations';

const { fetchFileTypes } = organizationsOperations;

const FilterFileTypes = (props) => {
  const dispatch = useDispatch();

  // Import state vars
  const { auth, organizations } = useSelector(
    (state) => ({
      auth: state.authState,
      organizations: state.organizationsState,
    }),
  );

  const { user: { organization_id: orgId } } = auth;
  const { updateFilters } = props;

  useEffect(() => {
    dispatch(fetchFileTypes(orgId, auth.token));
  }, [dispatch, orgId, auth.token]);

  const { fileTypes } = organizations;
  const fileTypesList = _.map(fileTypes, (fileType) => (
    {
      value: fileType.id,
      label: fileType.typename,
    }
  ));

  const buildParams = (option) => {
    const paramType = 'filter_filetypes';
    let paramList;
    if (option && option.length > 0) {
      paramList = _.map(option, (item) => `param_z_filetypes%5B%5D=${encodeURIComponent(item.label)}`).join('&');
    } else {
      // If options are cleared, reset to default param
      paramList = 'param_z_filetypes=all';
    }

    updateFilters(paramType, paramList);
  };

  return (
    <ReactSelect
      isMulti
      hideSelectedOptions
      options={fileTypesList}
      placeholder="File Types"
      onChange={(option) => buildParams(option)} />
  );
};

FilterFileTypes.propTypes = {
  updateFilters: PropTypes.func.isRequired,
};

export default FilterFileTypes;
