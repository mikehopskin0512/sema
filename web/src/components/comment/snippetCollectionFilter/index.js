import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { InputField } from 'adonis';
import { SearchIcon } from '../../Icons';
import CustomSelect from '../../activity/select';
import useAuthEffect from '../../../hooks/useAuthEffect';
import { tagsOperations } from '../../../state/features/tags';
import { addTags } from '../../../utils';
import { DROPDOWN_SORTING_TYPES, SEMA_CORPORATE_ORGANIZATION_ID } from '../../../utils/constants';
import usePermission from '../../../hooks/usePermission';
import styles from './snippetCollectionFilter.module.scss';
import { gray500 } from '../../../../styles/_colors.module.scss';
import { value } from 'lodash/seq';

const { fetchTagList } = tagsOperations;

const SnippetCollectionFilter = ({ filter, setFilter, collections }) => {
  const dispatch = useDispatch();
  const { tagState, auth } = useSelector(state => ({
    auth: state.authState,
    tagState: state.tagsState
  }));
  const { tags } = tagState;
  const { token } = auth;
  const { isOrganizationAdminOrLibraryEditor, checkAccess } = usePermission();
  const isSemaAdminOrLibraryEditor = checkAccess(SEMA_CORPORATE_ORGANIZATION_ID, 'canCreateCollections');

  const getRelevantTags = useCallback((types) => {
    if (!tags.length) return [];
    const tagsIds = collections?.reduce((acc, item) => {
      acc.push(item?.collectionData?.tags?.map(i => i.tag));
      return acc;
    }, []);
    const tagsToDisplay = addTags(tags, types);

    const ids = new Set(tagsIds?.flat());
    return tagsToDisplay?.filter(tag => ids.has(tag.value));
  }, [tags])


  useAuthEffect(() => {
    dispatch(fetchTagList(token));
  }, []);

  const sources = useMemo(() => {
    if (collections.length > 0) {
      const src = collections
        .map(item => item?.collectionData?.source)
        .filter((v, i, a) => v && a.indexOf(v) === i);
      return src.map(v => ({ value: v, label: v }));
    }
    return [];
  }, [collections]);

  const authors = useMemo(() => {
    if (collections.length > 0) {
      const filtered = collections
        .map(item => item?.collectionData?.author)
        .filter((v, i, a) => v && a.indexOf(v) === i);
      return filtered.map(v => ({ value: v, label: v }));
    }
    return [];
  }, [collections]);

  const statusOptions = [
    { value: true, label: 'Available' },
    { value: false, label: 'Archived' }
  ];

  const onChangeFilter = (type, value) => {
    setFilter({
      ...filter,
      [type]: value
    });
  };

  const [toggleSearch, setToggleSearch] = useState(false);

  const handleSearchToggle = () => {
    setToggleSearch(toggle => !toggle);
  };

  return (
    <>
      <div className="p-0 mb-0 columns is-multiline is-vcentered">
        <div className={clsx(`column ${styles['filter-box']}`)}>
          <CustomSelect
            selectProps={{
              options: getRelevantTags(['guide', 'other', 'custom']),
              placeholder: '',
              isMulti: true,
              onChange: value => onChangeFilter('labels', value),
              value: filter.labels
            }}
            label="Labels"
            showCheckbox
            outlined
          />
        </div>
        <div className={clsx(`column ${styles['filter-box']}`)}>
          <CustomSelect
            selectProps={{
              options: getRelevantTags(['language']),
              placeholder: '',
              isMulti: true,
              onChange: value => onChangeFilter('languages', value),
              value: filter.languages
            }}
            label="Languages"
            showCheckbox
            outlined
          />
        </div>
        <div className={clsx(`column ${styles['filter-box']}`)}>
          <CustomSelect
            selectProps={{
              options: sources,
              placeholder: '',
              isMulti: true,
              onChange: value => onChangeFilter('sources', value),
              value: filter.sources
            }}
            label="Source"
            showCheckbox
            outlined
          />
        </div>
        {isOrganizationAdminOrLibraryEditor() && <div className={clsx(`column ${styles['filter-box']}`)}>
          <CustomSelect
            selectProps={{
              options: authors,
              placeholder: '',
              isMulti: true,
              onChange: value => onChangeFilter('authors', value),
              value: filter.authors
            }}
            sortType={DROPDOWN_SORTING_TYPES.ALPHABETICAL_USER_PRIORIY_SORT}
            label="Author"
            showCheckbox
            outlined
          />
        </div>}
        {isSemaAdminOrLibraryEditor && (
          <div className={clsx(`column ${styles['filter-box']}`)}>
            <CustomSelect
              selectProps={{
                options: statusOptions,
                placeholder: '',
                isMulti: true,
                onChange: value => onChangeFilter('status', value),
                value: filter.status
              }}
              sortType={DROPDOWN_SORTING_TYPES.NO_SORT}
              label="Status"
              showCheckbox
              outlined
            />
          </div>
        )}
        <div className="field px-5 my-5 is-flex-grow-1 is-flex is-align-items-center is-justify-content-end">
          <SearchIcon
            color={gray500}
            size="medium"
            className="is-clickable"
            onClick={handleSearchToggle}
          />
        </div>
      </div>
      {toggleSearch && (
        <div
          className={clsx(`field mt-0 is-flex-grow-1 ${styles['search-bar']}`)}
        >
          <InputField
            className="has-background-white"
            type="text"
            placeholder="Search Collections"
            onChange={value => onChangeFilter('query', value)}
            value={filter.query}
            iconLeft={<SearchIcon />}
          />
        </div>
      )}
      <hr
        className={`has-background-gray-400 is-full-width ${styles.separator}`}
      />
    </>
  );
};

export default SnippetCollectionFilter;
