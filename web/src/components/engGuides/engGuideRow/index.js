import React from 'react';
import { isEmpty } from 'lodash';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './engGuideRow.module.scss';
import Checkbox from '../../checkbox';

const EngGuideRow = (props) => {
  const {
    author, body, collections, source, title, _id, tags, selected, handleSelectChange,
  } = props;

  const renderLanguages = (languagesArr) => {
    const languages = languagesArr.filter((item) => item.type === 'language');
    if (languages.length > 0) {
      return languages.map((language) => (<div key={`${_id}-language-${language._id}`} className={clsx('is-size-8 mr-5 tag is-primary is-uppercase is-rounded has-text-primary is-size-7 has-text-weight-semibold', styles.tag)}>{language.label}</div>
      ));
    }
    return 'No languages';
  };

  const renderTags = (tagsArr) => {
    const filteredTags = tagsArr.filter((item) => item.type === 'guide');
    if (filteredTags.length > 0) {
      return filteredTags.map((guide) => (<div key={`${_id}-tag-${guide._id}`} className={clsx('is-size-8 mr-5 mb-5 tag is-light is-uppercase is-rounded is-size-7 has-text-weight-semibold')}>{guide.label}</div>
      ));
    }
    return 'No Tags';
  };

  const onClickRow = () => {
    window.location = `/engineering/guide/${_id}`;
  };

  return (
    <tr className="has-background-white my-10 is-clickable" onClick={onClickRow}>
      <td className={clsx('py-15 has-background-white px-10')}>
        <div className="is-flex is-align-items-center">
          <div className="mr-10">
            <Checkbox value={selected} onChange={(value) => handleSelectChange(_id, value)} />
          </div>
          <div className={clsx('is-flex is-flex-direction-column is-justify-content-center', styles.document)}>
          <p className="has-text-weight-semibold is-size-5">{title}</p>
          <p className={clsx('is-size-6', styles.body)}>{body}</p>
        </div>
        </div>
      </td>
      <td className="py-15 has-background-white px-10">
        <div className="is-flex is-flex-direction-column is-justify-content-center">
          <p className="is-size-6">{collections.length > 0 ? collections[0].name : ''}</p>
        </div>
      </td>
      <td className={clsx('py-15 has-background-white px-10', styles['tag-col'])}>
        <div className="is-flex is-flex-direction-row is-justify-content-flex-start is-align-items-flex-star is-flex-wrap-wrap">
          {renderLanguages(tags)}
        </div>
      </td>
      <td className={clsx('py-15 has-background-white px-10', styles['tag-col'])}>
        <div className="is-flex is-flex-direction-row is-justify-content-flex-start is-align-items-flex-start is-flex-wrap-wrap">
          {renderTags(tags)}
        </div>
      </td>
      <td className="py-15 has-background-white px-10">
        <div className="is-flex is-flex-direction-column is-justify-content-center">
          <a href={source.url || '#'} className="has-text-black is-underlined">{source.name || ''}</a>
        </div>
      </td>
      <td className="py-15 has-background-white px-10">
        <div className="is-flex is-flex-direction-column is-justify-content-center">
          <p className="is-size-6 is-underlined">{isEmpty(author) ? 'user' : author}</p>
          {/* <p className="is-size-7">Date</p> */}
        </div>
      </td>
    </tr>
  );
};

EngGuideRow.defaultProps = {
  author: '',
  body: '',
  collections: [],
  source: {},
  title: '',
  _id: '',
  tags: [],
  selected: false,
  handleSelectChange: () => {},
};

EngGuideRow.propTypes = {
  author: PropTypes.string,
  body: PropTypes.string,
  collections: PropTypes.array,
  source: PropTypes.object,
  title: PropTypes.string,
  _id: PropTypes.string,
  tags: PropTypes.array,
  selected: PropTypes.bool,
  handleSelectChange: PropTypes.func,
};

export default EngGuideRow;
