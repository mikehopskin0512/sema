import React, { useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

import { CloseIcon, EyeIcon, EyeOffIcon } from '../../Icons';
import { black900, gray300, red600, green500 } from '../../../../styles/_colors.module.scss';
import styles from './addSnapshotModal.module.scss';
import { isEmpty } from 'lodash';
import { portfoliosOperations } from '../../../state/features/portfolios';
import Table from '../../table';

const { updateSnapshot, fetchPortfoliosOfUser } = portfoliosOperations;


export const SNAPSHOT_MODAL_TYPES = {
  CREATE: 'create',
  EDIT: 'edit',
};

const AddSnapshotModal = ({ active, onClose, type, snapshotId }) => {
  const dispatch = useDispatch();

  const { snapshotsState, portfoliosState, authState } = useSelector((state) => state);
  const { data: { snapshots } } = snapshotsState;
  const { data: { portfolios, portfolio }} = portfoliosState;
  const { token } = authState;
  const { handleSubmit } = useForm();

  const modalRef = useRef(null);

  const [idsArray, changeIdsArray] = useState([]);
  const [activePortfolio, changeActivePortfolio] = useState('');

  const data = type === 'snapshots' ? 
    snapshots.map(snapshot => ({
      title: snapshot.title,
      date: format(new Date(snapshot.updatedAt), 'MMM dd, yyyy'),
      id: snapshot._id,
    })) : 
    portfolios.map(portfolio => {
      let latestDate = new Date(portfolio.snapshots[0].id.updatedAt);
      portfolio.snapshots.forEach(snapshot => {
        if (new Date(snapshot.id.updatedAt) > latestDate) {
          latestDate = new Date(snapshot.id.updatedAt);
        }
      });
      return {
        title: portfolio._id, // fix this after adding portfolio name
        date: format(latestDate, 'MMM dd, yyyy'),
        type: portfolio.type,
        id: portfolio._id,
      };
    });

    // const columns = [
    //     {
    //       Header: type === 'portfolios' ? 'Portfolio' : 'Snapshot',
    //       accessor: 'title',
    //       className: 'pl-20 has-text-weight-semibold',
    //     },
    //     {
    //       Header: 'Date of last change',
    //       accessor: 'date',
    //       className: 'p-16',
    //     },
    //     {
    //         Header: '',
    //         isVisible: false,
    //         accessor: 'action',
    //         className: 'pb-10',
    //         Cell: ({ row }) => {
    //           return <input type={type === 'portfolios' ? 'radio' : 'checkbox'} style={{position: 'absolute', left: '40px', paddingBottom: '10px'}}/>
    //         }
    //     },
    //     // type !== 'snapshots' && {
    //     //   Header: 'Visibility',
    //     //   accessor: 'type',
    //     //   className: 'pl-20 py-10 has-background-white-50',
    //     // },
    // ];

    // if (type === 'portfolios') {
    //   columns.splice(2, 0, {
    //     Header: 'Visibility',
    //     accessor: 'type',
    //     className: 'p-16',
    //   })
    // }

  const onSubmit = async (data) => {
    let body = [];
    if (type === 'snapshots') {
      body = [...idsArray];
      console.log(portfolio._id, body);
      //await dispatch(postSnapshotToPortfolio(portfolio._id, body, token));
    } else {
      body.push(snapshotId);
      console.log(activePortfolio, body);
      //await dispatch(postSnapshotToPortfolio(activePortfolio, body, token));
    }
  }

  return (
    <div className={`modal ${active ? 'is-active' : ''}`} ref={modalRef}>
      <div className="modal-background" />
      <div className={clsx('modal-content px-10', styles.modalWindowContent)}>
        <div className="px-25 py-15 has-background-white border-radius-4px">
          <p className="has-text-black has-text-weight-bold is-size-4 mb-10">
            {type === 'portfolios' ? 'Add to portfolio' : 'Add Snapshot(s) to Portfolio'}
          </p>
          <div onClick={onClose} className="is-clickable" style={{ position: 'absolute', top: 20, right: 30 }}>
            <CloseIcon size="medium" color={black900} />
          </div>
          <div className="has-background-gray-300 px-10 py-10 is-flex border-radius-8px is-justify-content-space-between">
              <p className="pl-16">Portfolio</p>
              <p className="pl-100 has-text-align-left">Date of last change</p>
              <p className="mr-100">{type === 'portfolios' ? 'Visibility' : ''}</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* <Table data={data} columns={columns} /> */}
            {data.map(item => 
              <div style={{ borderBottom: `1px solid ${gray300}` }} className={`is-flex p-16 is-justify-content-space-between`}>
                <input className="mt-5" name={item.id} 
                  onChange={(e) => {
                    if (type === 'snapshots') {
                      if (idsArray.includes(e.target.name)) {
                        const result = idsArray.filter(id => id !== e.target.name);
                        changeIdsArray([...result]);
                      } else {
                        changeIdsArray([...idsArray, e.target.name]);
                      }
                    } else {
                      changeActivePortfolio(e.target.name);
                    }
                  }} 
                  type={type === 'portfolios' ? 'radio' : 'checkbox'} style={{ position: 'absolute', left: '40px', paddingBottom: '10px' }}/>
                <p className="pl-10">{item.title}</p>
                <p className={`has-text-align-left ${type === 'snapshots' ? 'ml-20' : ''}`}>{item.date}</p>
                <div className={`mr-80 mt-13 is-flex border-radius-24px ${item.type === 'public' ? 'has-background-green-50 has-text-green-500' : 'has-background-red-100 has-text-red-600'}`}>
                  {type==='portfolios' && <>
                  <div className="pl-5 pt-3">
                    {item.type === 'public' ? 
                      <EyeIcon size="small" color={green500}/> :
                      <EyeOffIcon size="small" color={red600}/>
                    }
                  </div>
                  <div className="px-10">
                    {item.type}
                  </div>
                  </>}
                </div>
              </div>
            )}
            <div className="is-flex is-justify-content-right mt-20">
              <button className="button has-text-weight-semibold is-size-7 mx-10" onClick={() => onClose()} type="button">Cancel</button>
              <button
                className={clsx('button is-primary has-text-weight-semibold is-size-7 mx-10')}
                type="submit"
              >
                {type === 'portfolios' ? 'Add to portfolio' : `Add ${idsArray.length} snapshots`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

AddSnapshotModal.propTypes = {
};

AddSnapshotModal.defaultProps = {
};

export default AddSnapshotModal;