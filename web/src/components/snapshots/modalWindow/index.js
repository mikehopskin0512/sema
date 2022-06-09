import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
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
import { snapshotsOperations } from '../../../state/features/snapshots';
import { portfoliosOperations } from '../../../state/features/portfolios';
import { alertOperations } from '../../../state/features/alerts';
import { parseSnapshotData } from '../../../utils/parsing';
import Toaster from '../../toaster';
import useOutsideClick from '../../../utils/useOutsideClick';
import { notify } from '../../toaster/index.js';

import { convertToRaw } from 'draft-js';
// TODO: import additional styles if needed / should be uncommented or deleted after full RTE implementation
//import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { createEditorState } from '../../markdownEditor/utils';
import MarkdownEditor from '../../markdownEditor';
import SelectField from '../../../components/inputs/selectField';
import { fetchPortfoliosOfUser } from '../../../state/features/portfolios/actions';

const { updateSnapshot } = portfoliosOperations;
const { createSnapshot } = snapshotsOperations;
const { triggerAlert, clearAlert } = alertOperations;

const createSnapSchema = yup.object()
  .shape({
    title: yup
      .string()
      .required('Title is required'),
    portfolio: yup
      .object().shape({
        label: yup.string(),
        id: yup.string()
      }).required('Portfolio is required')
  });

const editSnapSchema = yup.object()
  .shape({
    title: yup
      .string()
      .required('Title is required'),
  });

const getSnapshotSchema = (type) => {
  return type === SNAPSHOT_MODAL_TYPES.CREATE ? createSnapSchema : editSnapSchema;
}

export const SNAPSHOT_MODAL_TYPES = {
  CREATE: 'create',
  EDIT: 'edit',
};

export const SNAPSHOT_DATA_TYPES = {
  ACTIVITY: 'comments',
  SUMMARIES: 'summaries',
  SUMMARIES_AREA: 'summaries-area',
  TAGS: 'tags',
};

const SnapshotModal = ({
  active,
  onClose,
  snapshotData,
  type,
  dataType = snapshotData?.componentType,
}) => {
  const dispatch = useDispatch();
  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(getSnapshotSchema(type)),
  });

  const { auth, portfolios, alerts } = useSelector((state) => ({
    auth: state.authState,
    portfolios: state.portfoliosState.data.portfolios,
    alerts: state.alertsState,
  }));
  const { showAlert, alertType, alertLabel } = alerts;

  const { token, user } = auth;
  const { _id: portfolioId = null } = portfolios.length ? portfolios[0] : {};

  const modalRef = useRef(null);
  const [description, setDescription] = useState(createEditorState(snapshotData?.description));

  useOutsideClick(modalRef, onClose);

  const onSubmit = async (data) => {
    const selectedPortfolio = data.portfolio?.value;
    const isPortfolioToSet = selectedPortfolio && selectedPortfolio.value !== '-1';

    const snapshotDataForSave = {
      userId: user._id,
      title: data.title,
      description: JSON.stringify(convertToRaw(description.getCurrentContent())),
      componentType: dataType,
      isHorizontal: dataType === 'comments',
      componentData: {
        ...snapshotData.componentData,
        smartComments: parseSnapshotData(snapshotData.componentData.smartComments)
      }
    }

    try {
      if (type === SNAPSHOT_MODAL_TYPES.EDIT) {
        dispatch(updateSnapshot(snapshotData._id, { ...snapshotData, ...snapshotDataForSave }, token, true, () => notify('Snapshot was successfully edited.', { type: 'success' })));
        onClose();
      } else {
        if (isPortfolioToSet) {
          dispatch(createSnapshot(snapshotDataForSave, selectedPortfolio, token));
          dispatch(fetchPortfoliosOfUser(user._id, token));
          notify('Snapshot was added to your portfolio.', {
            description: (
              <>
                <Link href={`/${user?.identities?.[0]?.username}/portfolio/${portfolioId}`}>
                  <a>View portfolio</a>
                </Link>
              </>
            ),
            duration: 3000,
          });
        } else {
          dispatch(createSnapshot(snapshotDataForSave, null, token));
          notify('Snapshot was saved to the Snapshot Library.', { duration: 3000 });
        }

        reset();
        onClose();
      }
    } catch (e) {
      console.log(e)
      dispatch(triggerAlert('Unable to create snapshot!', 'error'));
      dispatch(clearAlert());
    }
  };

  const defaultSelectValue = { value: '-1', label: 'None' };
  const activityTypeData = useMemo(() => snapshotData?.componentData?.smartComments || [], [snapshotData]);
  const mappedPortfolios = useMemo(() => [defaultSelectValue, ...portfolios?.map(i => ({ value: i._id, label: i.title }))], [portfolios]);

  useEffect(() => {
    if (type === SNAPSHOT_MODAL_TYPES.EDIT && !isEmpty(snapshotData)) {
      reset({
        title: snapshotData.title,
      });
    }
  }, [snapshotData]);

  const containerStyle = useMemo(() => (dataType === SNAPSHOT_DATA_TYPES.ACTIVITY && activityTypeData?.length > 3) ? { overflowY: 'scroll', maxHeight: '372px' } : null, [dataType, activityTypeData]);

  return active && (
    <div className={`modal ${active ? 'is-active' : ''}`} ref={modalRef}>
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
      <div className="modal-background" />
      <div className={clsx('modal-content px-10', styles.modalWindowContent)} ref={modalRef}>
        <div className="px-25 py-15 has-background-white border-radius-4px">
          <p className="has-text-black has-text-weight-bold is-size-4 mb-20">
            {type === SNAPSHOT_MODAL_TYPES.CREATE ? 'Save snapshot to Portfolio' : 'Edit snapshot'}
          </p>
          <div onClick={onClose} className="is-clickable" style={{
            position: "absolute",
            top: 20,
            right: 30,
          }}>
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
              <MarkdownEditor readOnly={false} value={description} setValue={setDescription}/>
            </div>
            {type === SNAPSHOT_MODAL_TYPES.CREATE && (
              <div className="field mb-15">
                <Controller
                  name="portfolio"
                  control={control}
                  render={({ field }) => {
                    return (
                      <SelectField
                        title='Add to the following portfolio'
                        placeholder="None"
                        options={mappedPortfolios}
                        isRequired
                        error={errors?.portfolio?.message}
                        value={field.value}
                        {...field}
                      />
                    )}
                  }
                />
              </div>
            )}
            <div className="has-background-gray-300 p-10 mb-20" style={containerStyle}>
              {
                dataType === SNAPSHOT_DATA_TYPES.ACTIVITY && (
                  activityTypeData.map((d) => <ActivityItem {...d} className='is-full-width my-10' isSnapshot />)
                )
              }
              {dataType === SNAPSHOT_DATA_TYPES.SUMMARIES_AREA &&
                <SnapshotChartContainer chartType="reactions-area" {...snapshotData.componentData} />
              }
              {dataType === SNAPSHOT_DATA_TYPES.SUMMARIES &&
                <SnapshotChartContainer chartType="reactions" {...snapshotData.componentData} />
              }
              {dataType === SNAPSHOT_DATA_TYPES.TAGS &&
                <SnapshotChartContainer chartType="tags" {...snapshotData.componentData} />
              }
            </div>
            <div className="is-flex is-justify-content-space-between is-align-items-center">
              <p className='has-text-black'>{type === SNAPSHOT_MODAL_TYPES.CREATE ? 'All snapshots will be added to the snapshot library' : ''}</p>
              <div>
                <button className="button has-text-weight-semibold is-size-7 mx-10" onClick={() => onClose()} type="button">Cancel</button>
                <button
                  className={clsx('button is-primary has-text-weight-semibold is-size-7 mx-10')}
                  type="submit"
                >
                  {type === SNAPSHOT_MODAL_TYPES.CREATE ? 'Save' : 'Save Changes'}
                </button>
              </div>
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
