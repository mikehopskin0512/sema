import React, { ReactElement, useCallback, useMemo, useState } from 'react';
import styles from './groupedSelect.module.scss';
import useResizeObserver from 'use-resize-observer';
import useOutsideClick from '../../../../../hooks/useOutsideClick';

type OptionType = {
  id: string;
  name: string;
};

type SelectGroupType = {
  fieldName: string;
  options: any[];
};

type GroupedSelectField = {
  onChange: (id: string) => void;
  options: any;
  optionsMapper?: (object: any) => OptionType;
  containerClass?: string;
  containerWidth?: number | string;

  placeHolder?: string;
  value?: string;
  icon?: ReactElement;
};

const GroupedSelectField = ({
  onChange,
  options,
  optionsMapper,
  containerClass,
  containerWidth,
  placeHolder,
  icon,
  value,
}: GroupedSelectField) => {
  const [isOpened, setIsOpened] = useState(false);
  const { ref, width: selectWidth } = useResizeObserver<HTMLDivElement>();
  const overlayRef = useOutsideClick(() => setIsOpened(false));

  const getSelectedValue = (id: string) => {
    return id === value;
  };

  const generateItemClass = (id: string) => {
    const classes = [styles['grouped-select-item']];
    if (getSelectedValue(id))
      classes.push(styles['grouped-select-item--active']);
    return classes.join(' ');
  };

  const generateWrapperClass = () => {
    const classes = [styles['grouped-select']];
    if (icon) classes.push(styles['grouped-select--with-icon']);
    if (containerClass) classes.push(containerClass);
    return classes.join(' ');
  };

  const renderOptions = useCallback(
    (group: SelectGroupType) => {
      const { fieldName, options } = group;

      return (
        <div>
          <p className={styles['grouped-select-group-name']}>{fieldName}</p>
          {options.map((item) => {
            if (!item) return null;
            const formattedData = optionsMapper ? optionsMapper(item) : item;
            const { name, id } = formattedData;

            return (
              <p className={generateItemClass(id)} onClick={() => onChange(id)}>
                {name}
              </p>
            );
          })}
        </div>
      );
    },
    [options, value, optionsMapper]
  );

  const toggleSelectOpen = (e: any) => {
    e.preventDefault();
    setIsOpened(!isOpened);
  };

  const inputLabel = useMemo(() => {
    if (!options) return;

    const fieldKeys = Object.keys(options);

    const wholeData: OptionType[]  = fieldKeys.reduce((acc, key) => {
      return acc.concat(
        options[key].options?.map((item: any) =>
          optionsMapper ? optionsMapper(item) : item
        )
      );
    }, []);

    return wholeData.find((item: any) => item.id === value)?.name;
  }, [value, options]);

  return (
    <div
      className={styles['grouped-select-main-wrapper']}
      ref={ref}
      style={{ width: containerWidth ?? '100%' }}
    >
      <button
        className={generateWrapperClass()}
        onClick={toggleSelectOpen}
        type="button"
        ref={overlayRef}
      >
        <span className={styles['grouped-select-icon']}>{icon}</span>
        <p className={styles['grouped-select-value']}>
          {inputLabel ?? placeHolder}
        </p>
        <div className={styles['grouped-select-arrow']} />
      </button>
      {isOpened && (
        <div
          className={styles['grouped-select-overlay']}
          style={{ width: selectWidth }}
        >
          {Object.keys(options)?.map((key) => renderOptions(options[key]))}
        </div>
      )}
    </div>
  );
};

export default GroupedSelectField;
