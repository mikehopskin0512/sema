import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchIcon } from '../../Icons';
import CustomSelect from '../../activity/select';
import useAuthEffect from '../../../hooks/useAuthEffect';
import { tagsOperations } from '../../../state/features/tags';
import { addTags } from '../../../utils';

const { fetchTagList } = tagsOperations;

const SnippetCollectionFilter = ({ filter, setFilter }) => {
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

  const onChangeFilter = (type, value) => {
    setFilter({
      ...filter,
      [type]: value,
    });
  };

  return (
    <div className="has-background-white shadow px-15 py-5 columns is-vcentered">
      <div className="column is-one-third">
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
      <div className="column">
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
      <div className="column">
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
      <div className="column">
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
    </div>
  )
}

export default SnippetCollectionFilter;