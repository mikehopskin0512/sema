import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import ReactSelect from 'react-select';

import { organizationsOperations } from '../../state/features/organizations';

const { fetchRepositories } = organizationsOperations;

const FilterRepositories = (props) => {
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
    dispatch(fetchRepositories(orgId, auth.token));
  }, [dispatch, orgId, auth.token]);

  const { repositories } = organizations;
  const repositoriesList = _.map(repositories, (repository) => (
    {
      value: repository.id,
      label: repository.name,
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
