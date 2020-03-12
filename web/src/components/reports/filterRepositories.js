import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import ReactSelect from 'react-select';

import { repositoriesOperations } from '../../state/features/repositories';

const { fetchRepositories } = repositoriesOperations;

const FilterRepositories = (props) => {
  const dispatch = useDispatch();

  // Import state vars
  const { auth, repositories } = useSelector(
    (state) => ({
      auth: state.authState,
      repositories: state.repositoriesState,
    }),
  );

  const { user: { organization_id: orgId } } = auth;
  const { updateFilters } = props;

  useEffect(() => {
    dispatch(fetchRepositories(orgId, auth.token));
  }, [dispatch, orgId, auth.token]);

  const { data } = repositories;
  const repositoriesList = _.map(data, (user) => (
    {
      value: user.id,
      label: user.name,
    }
  ));

  const buildParams = (option) => {
    const paramType = 'filter_repositories';
    let paramList;
    if (option && option.length > 0) {
      paramList = _.map(option, (item) => `param_z_repositories%5B%5D=${encodeURIComponent(item.label)}`).join('&');
    } else {
      // If options are cleared, reset to default param
      paramList = 'param_z_repositories=all';
    }

    updateFilters(paramType, paramList);
  };

  return (
    <ReactSelect
      isMulti
      hideSelectedOptions
      options={repositoriesList}
      placeholder="Repositories"
      onChange={(option) => buildParams(option)} />
  );
};

FilterRepositories.propTypes = {
  updateFilters: PropTypes.func.isRequired,
};

export default FilterRepositories;
