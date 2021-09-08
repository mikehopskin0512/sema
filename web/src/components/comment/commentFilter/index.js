import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { sortBy } from 'lodash';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import styles from './commentFilter.module.scss';

const CommentFilter = ({ onSearch, tags, languages }) => {
  const {
    register, handleSubmit, reset, getValues, setValue,
  } = useForm();

  const onClearSearch = () => {
    reset();
    onSearch({
      search: '',
      tag: null,
      language: null,
    });
  };

  const onChangeSearch = (e) => {
    setValue('search', e.currentTarget.value);
    onSearch({
      search: e.currentTarget.value,
      language: getValues('language'),
      tag: getValues('tag'),
    });
  };

  const onChangeTag = (e) => {
    setValue('tag', e.currentTarget.value);
    onSearch({
      search: getValues('search'),
      language: getValues('language'),
      tag: e.currentTarget.value,
    });
  };

  const onChangeLanguage = (e) => {
    setValue('language', e.target.value);
    onSearch({
      search: getValues('search'),
      tag: getValues('tag'),
      language: e.target.value,
    });
  };

  return (
    <form>
      <div className={clsx('has-background-white border-radius-4px px-10 py-5 is-flex is-flex-wrap-wrap', styles['filter-container'])}>
        <div className="is-flex-grow-1 p-5">
          <div className="control has-icons-left has-icons-right">
            <input
              className="input has-background-white is-small"
              placeholder="Search suggested comments"
              type="text"
              {...register('search')}
              onChange={onChangeSearch}
            />
            <span className="icon is-small is-left">
              <FontAwesomeIcon icon={faSearch} />
            </span>
          </div>
        </div>
        <div className="is-flex">
          <div className="is-flex-grow-1 p-5">
            <div className={clsx('select is-small', styles.select)}>
              <select defaultValue="" className={clsx('has-background-white', styles.select)} {...register('tag')} onChange={onChangeTag}>
                <option value="">Tag</option>
                {tags.length > 0 ?
                  sortBy(tags, 'label').map((item) => <option value={item.label} key={`tag-${item.label}`}>{item.label}</option>) :
                  <option value="_" disabled>No options</option> }
              </select>
            </div>
          </div>
          <div className="is-flex-grow-1 p-5">
            <div className={clsx('select is-small', styles.select)}>
              <select defaultValue="" className={clsx('has-background-white', styles.select)} {...register('language')} onChange={onChangeLanguage}>
                <option value="">Language</option>
                {languages.length > 0 ?
                  sortBy(languages, 'label').map((item) => <option value={item.label} key={`lang-${item.label}`}>{item.label}</option>) :
                  <option value="_" disabled>No options</option>}
              </select>
            </div>
          </div>
        </div>
      </div>
      {(getValues('search') || getValues('tag') || getValues('language')) && (
        <div className="is-flex is-align-items-flex-end mt-20">
          {getValues('search') && <p className="is-size-6 mr-15 has-text-deep-black"><b>Search:</b> {getValues('search')}</p>}
          {getValues('tag') && <p className="is-size-6 mr-15 has-text-deep-black"><b>Tag:</b> {getValues('tag')}</p>}
          {getValues('language') && <p className="is-size-6 mr-15 has-text-deep-black"><b>Language:</b> {getValues('language')}</p>}
          <div
            className="is-clickable has-text-primary is-size-8 pb-3"
            aria-hidden
            onClick={onClearSearch}>
            Clear search results
          </div>
        </div>
      )}
    </form>
  );
};

CommentFilter.defaultProps = {
  tags: [],
  languages: [],
};

CommentFilter.propTypes = {
  onSearch: PropTypes.func.isRequired,
  tags: PropTypes.array,
  languages: PropTypes.array,
};

export default CommentFilter;
