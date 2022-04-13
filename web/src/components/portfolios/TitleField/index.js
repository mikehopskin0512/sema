import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { updatePortfolioTitle } from '../../../state/features/portfolios/actions';
import useOutsideClick from '../../../utils/useOutsideClick';
import titleFieldValidationSchema from './validationSchema';
import { EditIcon } from '../../Icons';

const TitleField = ({ isEditable, portfolio }) => {
  const dispatch = useDispatch();
  const [isInputActive, setIsInputActive] = useState(false);
  const inputRef = useRef(null);
  const { control, formState: { errors }, reset, handleSubmit, watch } = useForm({
    defaultValues: {
      title: '',
    },
    resolver: yupResolver(titleFieldValidationSchema),
  });
  const title = watch('title');

  const update = ({ title }) => {
    const isTitleChanged = title !== portfolio.title;
    if (isEditable && isTitleChanged) {
      dispatch(updatePortfolioTitle(portfolio._id.toString(), title));
    }
    setIsInputActive(false);
  };
  useOutsideClick(inputRef, handleSubmit(update));
  useEffect(() => {
    reset({ title: portfolio.title });
  }, [portfolio.title]);

  return (
    <div className="is-relative is-flex is-align-items-center">
      {isInputActive ? (
        <form onSubmit={handleSubmit(update)} ref={inputRef}>
          {/* TODO: focus should be improved here somehow */}
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <input
                className="is-size-4 has-text-gray-900 py-8 px-16 has-text-weight-semi-bold has-background-gray-200 border-none"
                value={field.value}
                onInput={(e) => field.onChange(e.target.value)}
                type="text"
              />
            )}
          />
          {errors?.title && (
            <div className="mt-3 is-size-7 has-text-red-500">
              <span>{errors.title.message}</span>
            </div>
          )}
        </form>
      ) : (
        <>
          <div className="is-size-4 has-text-weight-semi-bold">
            {title}
          </div>
          <div>
            {isEditable && (
              <EditIcon
                className="is-clickable ml-20 mt-5"
                onClick={() => setIsInputActive(true)}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

TitleField.defaultProps = {
  portfolio: {},
  isEditable: false,
};

TitleField.propTypes = {
  portfolio: PropTypes.object,
  isEditable: PropTypes.bool,
};

export default TitleField;
