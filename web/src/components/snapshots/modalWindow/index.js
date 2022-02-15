import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import ActivityItem from '../../activity/item';
import { CloseIcon } from '../../Icons';
import { black900 } from '../../../../styles/_colors.module.scss';
import { postSnapshots } from '../../../state/features/snapshots/api';
import { InputField } from 'adonis';
import styles from './modalWindow.module.scss';
import { isEmpty } from 'lodash';
import SnapshotChartContainer from '../snapshotChartContainer';
import { portfoliosOperations } from '../../../state/features/portfolios';

const { updateSnapshot, fetchPortfoliosOfUser } = portfoliosOperations;

const schema = yup.object().shape({
  title: yup
    .string()
    .required('Title is required'),
  description: yup
    .string()
    .required('Description is required'),
});

export const SNAPSHOT_MODAL_TYPES = {
  CREATE: 'create',
  EDIT: 'edit',
};

export const SNAPSHOT_DATA_TYPES = {
  ACTIVITY: 'comments',
  SUMMARIES: 'summaries',
  TAGS: 'tags',
};

const SnapshotModal = ({ active, onClose, snapshotData, type, dataType, startDate, endDate }) => {
  const dispatch = useDispatch();
  const { control, formState: { errors }, reset, handleSubmit, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const { auth, portfolios } = useSelector((state) => ({
    auth: state.authState,
    portfolios: state.portfoliosState.data.portfolios,
  }));

  const { token, user } = auth;
  const { _id: portfolioId = null } = portfolios.length ? portfolios[0] : {};

  const modalRef = useRef(null);

  const onSubmit = async (data) => {
    const snapshotDataForSave = {
      userId: user._id,
      title: data.title,
      description: data.description,
      componentType: dataType,
      componentData: snapshotData.componentData,
    }
    try {
      if (type === SNAPSHOT_MODAL_TYPES.EDIT) {
        const payload = await dispatch(updateSnapshot(snapshotData._id, { ...snapshotData, ...snapshotDataForSave }, token));
        if (payload.status === 200) {
          onClose();
        }
      } else {
        if (!portfolioId) {
          await dispatch(fetchPortfoliosOfUser(user._id, token));
        }
        await postSnapshots({ ...snapshotDataForSave, portfolioId }, token);
      }
    } catch (e) {
      console.log(e);
    }
    reset();
    onClose();
  };

  useEffect(() => {
    if (type === SNAPSHOT_MODAL_TYPES.EDIT && !isEmpty(snapshotData)) {
      reset({
        title: snapshotData.title,
        description: snapshotData.description
      });
    }
  }, [])

  return (
    <div className={`modal ${active ? 'is-active' : ''}`} ref={modalRef}>
      <div className="modal-background" />
      <div className={clsx('modal-content px-10', styles.modalWindowContent)}>
        <div className="px-15 py-10 has-background-white">
          <p className="has-text-black has-text-weight-bold is-size-4 mb-10">
            {type === SNAPSHOT_MODAL_TYPES.CREATE ? 'Save snapshot to Portfolio' : 'Edit snapshot'}
          </p>
          <div onClick={onClose} className="is-clickable" style={{ position: 'absolute', top: 20, right: 30 }}>
            <CloseIcon size="medium" color={black900} />
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="field mb-15">
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <InputField
                    title="Title"
                    textSizeClassName="aui-is-size-8"
                    {...field}
                    error={errors?.title?.message}
                  />
                )}
              />
            </div>
            <div className="field mb-15">
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <InputField
                    isMultiLine
                    title="Description"
                    textSizeClassName="aui-is-size-8"
                    {...field}
                    error={errors?.description?.message}
                  />
                )}
              />
            </div>
            <div className="has-background-gray-300 p-10 mb-20">
              {
                dataType === SNAPSHOT_DATA_TYPES.ACTIVITY && (
                  snapshotData?.componentData?.smartComments?.map((d) => <ActivityItem {...d} className='is-full-width' isSnapshot />)
                )
              }
              {dataType === SNAPSHOT_DATA_TYPES.SUMMARIES &&
                <SnapshotChartContainer chartType="reactions" {...snapshotData.componentData} />
              }
              {dataType === SNAPSHOT_DATA_TYPES.TAGS &&
                <SnapshotChartContainer chartType="tags" {...snapshotData.componentData} />
              }
            </div>
            <div className="is-flex is-justify-content-right">
              <button className="button has-text-weight-semibold is-size-7 mx-10" onClick={() => onClose()} type="button">Cancel</button>
              <button
                className={clsx('button is-primary has-text-weight-semibold is-size-7 mx-10')}
                type="submit"
              >
                {type === SNAPSHOT_MODAL_TYPES.CREATE ? 'Save' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

SnapshotModal.propTypes = {
  active: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.string,
  dataType: PropTypes.string,
};

SnapshotModal.defaultProps = {
  type: SNAPSHOT_MODAL_TYPES.CREATE,
  dataType: SNAPSHOT_DATA_TYPES.ACTIVITY,
};

export default SnapshotModal;