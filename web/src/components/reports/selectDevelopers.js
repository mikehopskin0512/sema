import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import ReactSelect from 'react-select';

import { usersOperations } from '../../state/features/users';

const { fetchUsers } = usersOperations;

const SelectContributor = (props) => {
  const dispatch = useDispatch();

  // Import state vars
  const { auth, users } = useSelector(
    (state) => ({
      auth: state.authState,
      users: state.usersState,
    }),
  );

  const { user: { organization_id: orgId } } = auth;
  const { updateFilters } = props;

  useEffect(() => {
    dispatch(fetchUsers(orgId, auth.token));
  }, [dispatch, orgId, auth.token]);

  const { data: committers } = users;
  const userList = _.map(committers, (user) => {
    return {
      value: user.id,
      label: `${user.first_name} ${user.last_name}`,
    };
  });

  const buildParams = (option) => {
    const paramType = 'param_z_developers';
    const paramList = _.map(option, (item) => `${paramType}[]=${encodeURIComponent(item.label)}`).join('&');

    updateFilters(paramType, paramList);
  };

  return (
    <ReactSelect
      isMulti
      hideSelectedOptions
      options={userList}
      placeholderButtonLabel="Developers"
      onChange={(option) => buildParams(option)} />
  );
};

SelectContributor.propTypes = {
  updateFilters: PropTypes.func.isRequired,
};

export default SelectContributor;
