import React, { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import ActivityItem from '../../activity/item';
import { CloseIcon } from '../../Icons';
import { black900 } from '../../../../styles/_colors.module.scss';
import ReactionChart from '../../stats/reactionChart';
import TagsChart from '../../stats/tagsChart';
import { postSnapshots } from '../../../state/features/snapshots/api';
import { InputField } from 'adonis';
import styles from './modalWindow.module.scss';

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

const SnapshotModal = ({ active, onClose, snapshotData, type, dataType }) => {

  const { control, formState: { errors }, reset, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const { auth, comments } = useSelector((state) => ({
    auth: state.authState,
    comments: state.commentsState,
  }));

  const { token, user } = auth;

  const modalRef = useRef(null);

  const configureComponentData = () => {
    switch(dataType) {
      //ToDo: fix some values for real
      case SNAPSHOT_DATA_TYPES.SUMMARIES:
        return {
          groupBy: snapshotData.groupBy,
          yAxisType: 'total',
          chartType: 'bar',
          reactions: Object.keys(comments.summary.reactions),
        };
      case SNAPSHOT_DATA_TYPES.TAGS:
        return {
          groupBy: snapshotData.groupBy,
          chartType: 'bar',
          tagBy: '',
          tags: Object.keys(comments.summary.tags),
        };
      case SNAPSHOT_DATA_TYPES.ACTIVITY:
        return snapshotData;
    }
  }

  const onSubmit = async (data) => {
    const snapshotDataForSave = {
      userId: user._id,
      title: data.title,
      description: data.description,
      commentType: dataType,
      componentData: configureComponentData(),
    }
    //ToDO: add edit snapshot request if type === SNAPSHOT_MODAL_TYPES.EDIT
    try {
      await postSnapshots(snapshotDataForSave, token);
    } catch(e) {
      console.log(e);
    }
    reset();
    onClose();
  };

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
            <div className="has-background-gray-300 pb-5 pt-15 pl-20 pr-5 mb-20">
            {dataType === SNAPSHOT_DATA_TYPES.ACTIVITY && (snapshotData.length ? snapshotData.slice(0, 3).map((item) => (
              <div className="mb-10" key={`activity-${item._id}`} >
                <ActivityItem {...item} isSnapshot />
              </div>
              )) : (
              <div className="my-10 p-20 has-background-white">
                <p>No activity found!</p>
              </div>
            ))}
            {dataType === SNAPSHOT_DATA_TYPES.SUMMARIES && 
              <ReactionChart isSnapshot className="ml-neg10" reactions={snapshotData.reactionChartData} yAxisType='total' groupBy={snapshotData.groupBy} />
            }
            {dataType === SNAPSHOT_DATA_TYPES.TAGS && 
              <TagsChart isSnapshot className="ml-neg10" tags={snapshotData.tagsChartData} groupBy={snapshotData.groupBy} />
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