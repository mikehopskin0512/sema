import React from 'react';
import clsx from 'clsx';
import styles from './engGuideRow.module.scss';

const EngGuideRow = () => {
  const renderLanguages = () => (<div className={clsx('tag is-primary is-uppercase is-rounded has-text-primary is-size-7 has-text-weight-semibold', styles.tag)}>React</div>);
  const renderTags = () => (<div className="tag is-light is-uppercase is-rounded is-size-7 has-text-weight-semibold">React</div>);
  return (
    <tr className="has-background-white my-10">
      <td className="py-15 has-background-white px-10">
        <div className="is-flex is-flex-direction-column is-justify-content-center">
          <p className="has-text-weight-semibold is-size-5">Aligment</p>
          <p className="is-size-6">Follow these alligment styles for JS...</p>
        </div>
      </td>
      <td className="py-15 has-background-white px-10">
        <div className="is-flex is-flex-direction-column is-justify-content-center">
          <p className="is-size-6">AirBnB Style Guide for React / JSX.</p>
        </div>
      </td>
      <td className="py-15 has-background-white px-10">
        <div className="is-flex is-flex-direction-row is-justify-content-flex-start is-align-items-flex-star is-flex-wrap-wrap">
          {renderLanguages()}
        </div>
      </td>
      <td className="py-15 has-background-white px-10">
        <div className="is-flex is-flex-direction-row is-justify-content-flex-start is-align-items-flex-start is-flex-wrap-wrap">
          {renderTags()}
        </div>
      </td>
      <td className="py-15 has-background-white px-10">
        <div className="is-flex is-flex-direction-column is-justify-content-center">
          <a href="https://google.com" className="has-text-black is-underlined">Google</a>
        </div>
      </td>
      <td className="py-15 has-background-white px-10">
        <div className="is-flex is-flex-direction-column is-justify-content-center">
          <p className="is-size-6 is-underlined">Author</p>
          <p className="is-size-7">Date</p>
        </div>
      </td>
    </tr>
  );
};

export default EngGuideRow;
