import React, { useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { InputField } from 'adonis';
import styles from './editModal.module.scss';
import { CloseIcon } from '../../Icons';

const schema = yup.object().shape({
  title: yup
    .string()
    .matches(/^[0-9A-Za-z()@:_ +.~#?&/=^\-*]*$/, 'Do not use ! % $ $'),
});

const EditPortfolioTitle = ({ isOpen, onClose, profileTitle, onSubmit }) => {
  const { control, formState: { errors }, setValue, handleSubmit  } = useForm({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    setValue('title', profileTitle);
  }, [profileTitle]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={clsx('modal', isOpen && 'is-active')}>
        <div className="modal-background" />
        <div className={clsx('modal-card', styles.modal)}>
          <div className="has-background-white px-30 pt-30 is-flex is-justify-content-space-between is-align-items-center">
            <p className="modal-card-title has-text-black-950 has-text-weight-semibold">Edit Portfolio Title</p>
            <CloseIcon onClick={onClose} />
          </div>
          <section className="modal-card-body p-0">
            <div className="p-30">
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <InputField
                    className="input mt-5"
                    placeholder="Write your title..."
                    title="Title"
                    {...field}
                    error={errors?.title?.message}
                  />
                )}
              />
              <div className="is-flex is-align-items-center is-justify-content-flex-end mt-20">
                <button type="button" className="button" onClick={onClose}>Cancel</button>
                <button type="submit" className="button is-primary ml-10" onClick={handleSubmit}>Save changes</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
};

EditPortfolioTitle.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  profileTitle: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default EditPortfolioTitle;
