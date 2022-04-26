import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FolderIcon } from '../icons/FolderIcon';
import GroupedSelectField from '../inputs/GroupedSelect';

const collectionsSelector = ({ value, onChange }) => {
  const {
    teams,
    user: { collections: userCollections },
  } = useSelector((state) => state);

  const teamsCollections = teams
    .filter((team) => team.role.canCreateSnippets)
    .map(({ team }) => ({
      ...team,
      collections: team.collections.filter((collection) => collection.isActive),
    })).reduce((acc, item) => {
      acc.push(item?.collections ?? []);
      return acc;
    }, []).flat();

  const preparedCollectionsData = useMemo(() => {
    const variants = {};
    if (userCollections.length) {
      variants.userCollections = {
        fieldName: 'My Snippets',
        options: userCollections ?? [],
      };
    }

    if (teamsCollections.length) {
      variants.teamCollections = {
        fieldName: 'Team Snippets',
        options: teamsCollections ?? [],
      };
    }

    return variants;
  }, [teamsCollections, userCollections]);

  const selectOptionsMapper = (obj) => {
    return {
      id: obj.collectionData?._id,
      name: obj.name ?? obj.collectionData?.name,
    };
  };

  return (
    <GroupedSelectField
      icon={<FolderIcon />}
      onChange={onChange}
      options={preparedCollectionsData}
      placeHolder="Choose Snippet Collection"
      value={value}
      optionsMapper={selectOptionsMapper}
    />
  );
};

export default collectionsSelector;
