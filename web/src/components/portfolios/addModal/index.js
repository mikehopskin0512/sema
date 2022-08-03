import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { CloseIcon } from '../../../components/Icons';
import styles from './addModal.module.scss';
import { fetchUserSnapshots } from '../../../state/features/snapshots/actions';
import Table from '../../../components/table';
import Checkbox from '../../../components/checkbox';
import { addSnapshotsToPortfolio } from '../../../state/features/portfolios/actions';
import { notify } from '../../../components/toaster/index';
import { MONTH_DAY_YEAR_FORMAT } from '../../../utils/constants/date';

const AddModal = ({
  isModalActive,
  toggleModalActive,
  portfolio
}) => {
  const [idsToAdd, setIdsToAdd] = useState([]);
  const dispatch = useDispatch();
  const {
    authState,
    snapshotsState,
  } = useSelector((state) => state);
  const {
    user: userData,
    token,
  } = authState;
  const { _id: userId = '' } = userData;
  const {
    data: { snapshots },
  } = snapshotsState;

  useEffect(() => {
    dispatch(fetchUserSnapshots(userId, token));
  }, []);

  const formattedSnapshots = useMemo(() =>
    !Array.isArray(snapshots) ? [] :
    snapshots
      .filter(item => !portfolio?.snapshots?.find(snap => snap.id?._id === item._id))
      ?.map((snapshot) => ({
        title: snapshot.title,
        updatedAt: format(new Date(snapshot.updatedAt), MONTH_DAY_YEAR_FORMAT),
        id: snapshot._id,
      }))
      .sort((a, b) => a.title.localeCompare(b.title)), [snapshots, portfolio, isModalActive]);

  const setSnapsToAdd = (id) => {
    return setIdsToAdd((ids) => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]);
  };

  const closeModal = () => {
    setIdsToAdd([]);
    toggleModalActive(false);
  };

  const onPortfolioUpdate = async () => {
    dispatch(addSnapshotsToPortfolio({
      portfolioId: portfolio._id,
      snapshots: idsToAdd,
      token,
      onSuccess: (snapshots) => {
        notify(
          'Snapshots were added to this portfolio',
          {
            subtitle: `You've successfully added ${snapshots.length} Snapshots.`,
            duration: 3000,
          });
        closeModal();
      },
      onError: () => {
        notify('Snapshot was not added', {
          type: 'error',
          duration: 3000,
        });
      },
      userId
    }));
  };

  const columns = [
    {
      Header: 'Title',
      accessor: 'title',
      className: 'p-15 has-text-weight-semibold',
      Cell: ({ row }) => {
        const {
          values,
          original,
        } = row;
        const id = original?.id ?? '';

        return (
          <div className='is-inline-flex is-align-items-center'>
            <div className='mr-8'>
              <Checkbox value={idsToAdd.includes(id)} onChange={() => setSnapsToAdd(id)} />
            </div>
            <p className={styles['table-cell-value']}>{values.title}</p>
          </div>
        );
      },
    },
    {
      Header: 'Date of last change',
      accessor: 'updatedAt',
      className: 'p-16 has-text-weight-semibold',
      Cell: ({ row }) => {
        return (
          <span className={styles['table-cell-value']}>{row.values.updatedAt}</span>
        );
      },
    },
  ];

  if (!snapshots) return null;

  return (
    <div className={clsx('modal', isModalActive && 'is-active')}>
      <div className='modal-background' />
      <div className={clsx('modal-card', styles.modal)}>
        <header className={clsx('modal-card-head has-background-white is-align-items-center border-none pl-40 pr-40')}>
          <div className='is-full-width'>
            <p className={clsx('modal-card-title has-text-weight-semibold')}>
              Add Snapshot(s) to Portfolio
            </p>
          </div>
          <button type='button' onClick={() => toggleModalActive(false)} className={clsx('button is-ghost has-text-black-900', styles['close-btn'])}>
            <CloseIcon size='medium' />
          </button>
        </header>
        <section className={clsx('modal-card-body pl-40 pr-40 pt-0 pb-0', styles['modal-body'])}>
          <Table
            minimal
            className='overflow-unset shadow-none'
            data={formattedSnapshots}
            columns={columns}
          />
        </section>
        <section className={clsx('modal-card-body p-0', styles['modal-body'])}>
          <div className='pr-40 pl-40 pt-25 pb-40'>
            <div className='is-flex is-align-items-center is-justify-content-space-between'>
              <div />
              <div>
                <button type='button' className='button' onClick={closeModal}>Cancel</button>
                <button type='button' className='button is-primary ml-10' onClick={onPortfolioUpdate} disabled={!idsToAdd.length}>
                  {`Add ${idsToAdd.length} Snapshots`}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddModal;
