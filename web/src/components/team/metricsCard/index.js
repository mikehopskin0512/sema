import React from 'react'
import clsx from 'clsx'
import styles from './metricsCard.module.scss'
import Tooltip from '../../Tooltip';
import { InfoFilledIcon } from '../../Icons';

const MetricsCard = ({ title, value, tooltip }) => {
  return (
    <>
      <div className={clsx('column mx-20 m-5 py-20 border-radius-4px is-flex is-align-items-center', styles['card'])}>
        <div className="">
          <div className={clsx('is-size-7', styles['card-title'])}>
            <span className="mr-8 is-uppercase">{title}</span>
            <Tooltip text={tooltip}>
              <InfoFilledIcon size="small" />
            </Tooltip>
          </div>
          <div
            className={clsx('is-size-3 has-text-weight-semibold has-text-deep-black', styles['card-subtitle'])}
          >
            {value}
          </div>
        </div>
        <div></div>
      </div>
    </>
  )
}

export default MetricsCard
