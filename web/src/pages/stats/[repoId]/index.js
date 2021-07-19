import React from 'react';
import clsx from 'clsx';
import styles from './stats.module.scss';
import CalendarPopover from '../../../components/calendarPopover';
import Sidebar from '../../../components/sidebar';
import withLayout from '../../../components/layout';

const Stats = () => {
  const setDate = (dates) => {
    alert(`
      start: ${dates.startDate.toString()}
      end: ${dates.endDate.toString()}
    `);
  };

  return (
    <Sidebar>
      <div className="is-flex is-justify-content-space-between is-flex-wrap-wrap px-10">
        <p className="has-text-deep-black has-text-weight-semibold is-size-4">Repo Stats</p>
        <CalendarPopover setDate={setDate} />
      </div>
      <div className="is-flex is-flex-wrap-wrap mt-20">
        <div className="is-flex-grow-1 px-10">
          <div className={clsx('has-background-white border-radius-2px p-15', styles.shadow)}>
            <p className="has-text-deep-black has-text-weight-semibold">Reactions</p>
          </div>
        </div>
        <div className="is-flex-grow-1 px-10">
          <div className={clsx('has-background-white border-radius-2px p-15', styles.shadow)}>
            <p className="has-text-deep-black has-text-weight-semibold">Tags</p>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default withLayout(Stats);
