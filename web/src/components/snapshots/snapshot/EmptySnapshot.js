import React from "react";
import clsx from "clsx";
import styles from "../../../components/snapshots/snapshot/snapshot.module.scss";

export const EmptySnapshot = () => {
  return (
    <div className={clsx(styles.snapshot, styles["empty-chart-wrapper"], "has-background-gray-200 mb-0 is-relative")}>
      <div className={styles["empty-chart-container"]}>
        <div className='is-full-width'>
          <p className={clsx(styles["empty-chart-title"], "mb-15")}>Shapshot on the left is so lonely!</p>
          <p className={styles["empty-chart-desc"]}>Add another one here.</p>
        </div>
        <img src='/img/empty-chart.png' alt="Empty chart image" className={clsx(styles["empty-chart-img"])} />
      </div>
    </div>
  );
};
