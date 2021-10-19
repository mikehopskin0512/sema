import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import LabelForm, { initialValues } from '../../components/labels-management/LabelForm';
import withLayout from '../../components/layout';
import Helmet from '../../components/utils/Helmet';

const AddLabels = () => {
  const router = useRouter();

  const [tags, setTags] = useState([initialValues]);

  const onCancel = async () => {
    await router.back();
  };

  const onChangeData = (name, val, index) => {
    const newTags = [...tags];
    newTags[index][name] = val;
    console.log({ newTags, name, val, index })
    setTags(newTags);
  };

  const onAddLabel = () => {
    setTags([...tags, initialValues])
  }

  const onSubmit = () => {
    console.log({ tags })
  };

  return(
    <div className="my-50">
      <Helmet title="Add label" />
      <div className="is-flex is-align-items-center px-10 mb-25">
        <a href="/labels-management" className="is-hidden-mobile">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-10" color="#000" />
        </a>
        <nav className="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li><a href="/labels-management" className="has-text-grey">Label management</a></li>
            <li className="is-active has-text-weight-semibold"><div className="px-5">Add Label</div></li>
          </ul>
        </nav>
      </div>
      <div className="is-flex mb-25 is-justify-content-space-between is-align-items-center">
        <div className="is-flex is-flex-wrap-wrap is-align-items-center">
          <p className="has-text-weight-semibold has-text-deep-black is-size-4 mr-10">
            Add label
          </p>
        </div>
        <div className="is-flex">
          <button
            className="button is-small is-outlined is-primary border-radius-4px mr-10"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="button is-small is-primary border-radius-4px"
            type="button"
            onClick={onSubmit}
          >
            <FontAwesomeIcon icon={faCheck} className="mr-10" />
            Save
          </button>
        </div>
      </div>
      { tags.map((_tag, index) => <LabelForm onChangeData={onChangeData} id={index} data={_tag} key={index} />)}
      <button
          className="button is-small is-outlined is-primary border-radius-4px mt-20"
          type="button"
          onClick={onAddLabel}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-10" />
          Add another label
        </button>
    </div>
  )
}

export default withLayout(AddLabels);