import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FolderIcon } from '../icons/FolderIcon';
import GroupedSelectField from '../inputs/GroupedSelect';
import { DEFAULT_COLLECTION_NAME } from '../../constants';

const collectionsSelector = ({ value, onChange }) => {
  const {
    organizations,
    user: { collections: userCollections },
  } = useSelector((state) => state);

  const organizationsCollections = organizations
    .filter((organization) => organization?.role?.canCreateSnippets)
    .map(({ organization = {}}) => ({
      ...organization,
      collections: organization?.collections?.filter((collection) => collection?.isActive && collection?.collectionData?.type !== 'community'),
    })).reduce((acc, item) => {
      acc.push(item?.collections ?? []);
      return acc;
    }, []).flat();

  const preparedCollectionsData = useMemo(() => {
    const variants = {};
    if (userCollections.length) {
      variants.userCollections = {
        fieldName: 'My Snippets',
        options: userCollections.filter(collection => collection.collectionData?.name?.toLowerCase() === DEFAULT_COLLECTION_NAME) ?? [],
      };
    }

    if (organizationsCollections.length) {
      variants.teamCollections = {
        fieldName: 'Organization Snippets',
        options: organizationsCollections ?? [],
      };
    }

    return variants;
  }, [organizationsCollections, userCollections]);

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
