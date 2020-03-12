import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import ReactSelect from 'react-select';

import { organizationsOperations } from '../../state/features/organizations';

const { fetchUsers } = organizationsOperations;

const FilterDevelopers = (props) => {
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
    dispatch(fetchUsers(orgId, auth.token));
  }, [dispatch, orgId, auth.token]);

  const { developers } = organizations;
  const userList = _.map(developers, (user) => (
    {
      value: user.id,
      label: `${user.first_name} ${user.last_name}`,
    }
  ));

  const buildParams = (option) => {
    const paramType = 'filter_developers';
    let paramList;
    if (option && option.length > 0) {
      paramList = _.map(option, (item) => `param_z_developers%5B%5D=${encodeURIComponent(item.label)}`).join('&');
    } else {
      // If options are cleared, reset to default param
      paramList = 'param_z_developers=all';
    }

    updateFilters(paramType, paramList);
  };

  return (
    <ReactSelect
      isMulti
      hideSelectedOptions
      options={userList}
      placeholder="Developers"
      onChange={(option) => buildParams(option)} />
  );
};

FilterDevelopers.propTypes = {
  updateFilters: PropTypes.func.isRequired,
};

export default FilterDevelopers;
