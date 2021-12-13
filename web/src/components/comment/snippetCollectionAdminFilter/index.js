import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchIcon } from '../../Icons';
import CustomSelect from '../../activity/select';
import useAuthEffect from '../../../hooks/useAuthEffect';
import { tagsOperations } from '../../../state/features/tags';
import { addTags } from '../../../utils';

const { fetchTagList } = tagsOperations;

const SnippetCollectionAdminFilter = ({ filter, setFilter }) => {
  const dispatch = useDispatch();
  const { tagState, auth, collectionState } = useSelector((state) => ({
    auth: state.authState,
    tagState: state.tagsState,
    collectionState: state.collectionsState,
  }));
  const { tags } = tagState;
  const { token } = auth;

  useAuthEffect(() => {
    dispatch(fetchTagList(token));
  }, []);

  const sources = useMemo(() => {
    const { data = [] } = collectionState ?? {};
    if (data.length > 0) {
      const src = data?.map((item) => item?.collectionData?.source)
        .filter((v, i, a) => v && a.indexOf(v) === i);
      return src.map((v) => ({ value: v, label: v }));
    }
    return [];
  }, [collectionState]);

  const authors = useMemo(() => {
    const { data = [] } = collectionState ?? {};
    if (data.length > 0) {
      const filtered = data?.map((item) => item?.collectionData?.author)
        .filter((v, i, a) => v && a.indexOf(v) === i);
      return filtered.map((v) => ({ value: v, label: v }));
    }
    return [];
  }, [collectionState]);

  const statusOptions = [
    { value: false, 'label': 'Inactive' },
    { value: true, 'label': 'Active' }
  ];

  const onChangeFilter = (type, value) => {
    setFilter({
      ...filter,
      [type]: value,
    });
  };

  return (
    <>
      <div className="has-background-white shadow p-10 mx-neg12 mt-neg12 mb-12">
        <div className="is-full-width px-15 pt-20 pb-10">
          <div className="control has-icons-left has-icons-right">
            <input
              onChange={(e) => onChangeFilter('query', e.target.value)}
              className="input has-background-white"
              type="input"
              placeholder="Search Collections and Snippets"
            />
            <span className="icon is-small is-left">
              <SearchIcon size="small" />
            </span>
          </div>
        </div>
        <div className="columns is-vcentered px-15 py-5">
          <div className="column is-one-fifth">
            <CustomSelect
              selectProps={{
                options: addTags(tags, ['guide', 'other', 'custom']),
                placeholder: '',
                isMulti: true,
                onChange: ((value) => onChangeFilter('labels', value)),
                value: filter.labels,
              }}
              label="Labels"
              showCheckbox
              outlined
            />
          </div>
          <div className="column is-one-fifth">
            <CustomSelect
              selectProps={{
                options: addTags(tags, ['language']),
                placeholder: '',
                isMulti: true,
                onChange: ((value) => onChangeFilter('languages', value)),
                value: filter.languages,
              }}
              label="Languages"
              showCheckbox
              outlined
            />
          </div>
          <div className="column is-one-fifth">
            <CustomSelect
              selectProps={{
                options: sources,
                placeholder: '',
                isMulti: true,
                onChange: ((value) => onChangeFilter('sources', value)),
                value: filter.sources,
              }}
              label="Source"
              showCheckbox
              outlined
            />
          </div>
          <div className="column is-one-fifth">
            <CustomSelect
              selectProps={{
                options: authors,
                placeholder: '',
                isMulti: true,
                onChange: ((value) => onChangeFilter('authors', value)),
                value: filter.authors,
              }}
              label="Author"
              showCheckbox
              outlined
            />
          </div>
          <div className="column is-one-fifth">
            <CustomSelect
              selectProps={{
                options: statusOptions,
                placeholder: '',
                isMulti: true,
                onChange: ((value) => onChangeFilter('status', value)),
                value: filter.status,
              }}
              label="Status"
              showCheckbox
              outlined
            />
          </div>
        </div>
      </div>

    </>
  )
}

export default SnippetCollectionAdminFilter;