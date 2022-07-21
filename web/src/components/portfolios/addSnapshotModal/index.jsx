import React, { useRef, useState } from 'react';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

import { CloseIcon, EyeIcon, EyeOffIcon } from '../../Icons';
import { black900, green500, red600 } from '../../../../styles/_colors.module.scss';
import styles from './addSnapshotModal.module.scss';
import { portfoliosOperations } from '../../../state/features/portfolios';
import Table from '../../table';
import Checkbox from '../../checkbox';
import CustomRadio from '../../radio';
import { PATHS } from '../../../utils/constants';
import { MONTH_DAY_YEAR_FORMAT } from '../../../utils/constants/date';
import { isEmpty } from 'lodash';
import { addSnapshotsToPortfolio } from '../../../state/features/portfolios/actions';

const { addSnapshotToPortfolio } = portfoliosOperations;


export const ADD_SNAPSHOT_MODAL_TYPES = {
  SNAPSHOTS: 'snapshots',
  PORTFOLIOS: 'portfolios',
};

export const isSnapshotsModalType = (type) => type === ADD_SNAPSHOT_MODAL_TYPES.SNAPSHOTS;

const AddSnapshotModal = ({ active, onClose, type, snapshotId, showNotification }) => {
  const dispatch = useDispatch();

  const { snapshotsState, portfoliosState, authState } = useSelector((state) => state);
  const { data: { snapshots } } = snapshotsState;
  const { data: { portfolios, portfolio }} = portfoliosState;
  const { token, user } = authState;
  const { handleSubmit } = useForm();

  const modalRef = useRef(null);

  const [ids, changeIds] = useState([]);
  const [activePortfolio, changeActivePortfolio] = useState('');

  const data = isSnapshotsModalType(type) ?
    snapshots.map(snapshot => ({
      title: snapshot.title,
      date: format(new Date(snapshot.updatedAt), MONTH_DAY_YEAR_FORMAT),
      id: snapshot._id,
    })) :
    portfolios.map(portfolio => ({
        title: portfolio.title,
        date: format(new Date(portfolio.updatedAt), MONTH_DAY_YEAR_FORMAT),
        type: portfolio.type,
        id: portfolio._id,
      })
    );

  const columns = [
    {
      Header: () => (
        <div className="py-8 my-12 is-flex is-align-items-center">
          <div className="is-uppercase is-size-8 is-line-height-1 ml-8">{!isSnapshotsModalType(type) ? 'Portfolio' : 'Snapshot'}</div>
        </div>
        ),
      accessor: 'title',
      className: 'px-8 has-text-weight-bold is-size-7',
      Cell: ({ row, cell }) => {
        const isTarget = ids.includes(row.values.id);
        return (<div className="is-flex px-8 my-12">
          {isSnapshotsModalType(type) ?
          <Checkbox
            value={isTarget}
            onChange={() => {
              if (isTarget) {
                changeIds(ids.filter(id => id !== row.values.id));
              } else {
                changeIds([...ids, row.values.id]);
              }
            }}
          /> :
          <CustomRadio
            checked={row.values.id === activePortfolio}
            onChange={() => changeActivePortfolio(row.values.id)}
          />
          }
          <span className={`${isSnapshotsModalType(type) ? 'pl-10' : ''}`}>{cell.value}</span>
        </div>)
        },
          sorted: true,
      },
      {
        Header: () => <div className="ml-40 is-uppercase is-line-height-1 is-size-8">Date of last change</div>,
        accessor: 'date',
        className: 'has-text-weight-bold is-size-7',
        Cell: ({ cell }) => (
          <div className="ml-40">
            {cell.value}
          </div>
          ),
      },
      {
        Header: '',
        isVisible: false,
        accessor: 'id',
        className: 'is-hidden',
      },
    ];

  if (!isSnapshotsModalType(type)) {
    columns.splice(2, 0, {
      Header: () => <div className="is-uppercase is-line-height-1 is-size-8">Visibility</div>,
      accessor: 'type',
      Cell: ({ row }) => {
        return (
          <div style={{maxWidth: '90px'}} className={`is-flex border-radius-24px ${row.values.type === 'public' ? 'has-background-green-50 has-text-green-500' : 'has-background-red-100 has-text-red-600'}`}>
            <div className="px-5 pt-8">
              {row.values.type === 'public' ?
                <EyeIcon size="small" color={green500}/> :
                <EyeOffIcon size="small" color={red600}/>
              }
            </div>
            <div className="p-5">
              {row.values.type}
            </div>
          </div>)
      }
    })
  }

  const onSubmit = async () => {
    try {
      let body = { snapshots: [] };
      if (isSnapshotsModalType(type)) {
        body.snapshots = [...ids];
        await dispatch(addSnapshotToPortfolio(portfolio._id, body, token));
      } else {
        body.snapshots.push(snapshotId);
        await dispatch(addSnapshotsToPortfolio({
          portfolioId: activePortfolio,
          token,
          snapshots: [snapshotId],
          userId: user._id,
          type: 'list'
        }));
      }
      if (!isEmpty(portfoliosState.error)) {
        showNotification(true);
      } else if (isSnapshotsModalType(type)) {
        showNotification(false);
      } else {
        showNotification(false, PATHS.PORTFOLIO.VIEW(user.handle, activePortfolio));
      }
    } catch (error) {
      showNotification(true);
    }
    onClose();
  }

  return (
    <div className={`modal ${active ? 'is-active' : ''}`} ref={modalRef}>
      <div className="modal-background" />
      <div className={clsx('modal-content px-10', styles.modalWindowContent)}>
        <div className="px-25 py-15 has-background-white border-radius-4px">
          <div className="is-flex is-justify-content-space-between mb-10">
            <p className="has-text-black has-text-weight-bold is-size-4 mb-10">
              {!isSnapshotsModalType(type) ? 'Add to portfolio' : 'Add Snapshot(s) to Portfolio'}
            </p>
            <div onClick={onClose} className="is-clickable pt-10">
              <CloseIcon size="medium" color={black900} />
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Table data={data} columns={columns} minimal/>
            <div className="is-flex is-justify-content-right mt-20">
              <button className="button has-text-weight-semibold is-size-7 mx-10" onClick={() => onClose()} type="button">Cancel</button>
              <button
                className={clsx('button is-primary has-text-weight-semibold is-size-7 mx-10')}
                type="submit"
                disabled={!isSnapshotsModalType(type) ? !activePortfolio : !ids.length}
              >
                {!isSnapshotsModalType(type) ? 'Add to portfolio' : `Add ${ids.length} snapshots`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

AddSnapshotModal.propTypes = {
  active: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  snapshotId: PropTypes.string,
  showNotification: PropTypes.func,
};

AddSnapshotModal.defaultProps = {
  showNotification: () => {},
};

export default AddSnapshotModal;
