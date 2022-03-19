import clsx from 'clsx';
import { format } from "date-fns";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { OptionsIcon, PlusIcon, ShareIcon } from '../../../../components/Icons';
import DropDownMenu from "../../../../components/dropDownMenu";
import Table from "../../../../components/table";

const portfolioList = () => {
  // const dispatch = useDispatch();
  const { portfoliosState } = useSelector((state) => state);
  const {
    data: { portfolios },
  } = portfoliosState;
  const addPortfolio = () => {};

  const tableData = portfolios.map((portfolio, i) => ({
    // TODO: will be fixed in portfolio name ticket
    title: `Portfolio ${i}`,
    updatedAt: format(new Date(portfolio.updatedAt), 'MMM dd, yyyy'),
    type: portfolio.type,
  }));

  const columns = [
    {
      Header: 'Title',
      accessor: 'title',
      className: 'p-16 has-text-weight-semibold',
    },
    {
      Header: 'Date of last change',
      accessor: 'updatedAt',
      className: 'p-16',
    },
    {
      Header: 'Visibility',
      accessor: 'type',
      className: 'p-16',
      // TODO: visibility badge component
      Cell: ({ value }) => <div>{value}</div>,
    },
    {
      Header: '',
      isVisible: false,
      accessor: 'action',
      className: 'pl-20 py-10 has-background-white-50',
      Cell: ({ row }) => {
        const isPublic = row.values.type === 'public';
        return (
          <div className="is-flex is-justify-content-flex-end">
            <div className={clsx(
              'is-flex mr-20',
              isPublic && 'is-cursor-pointer',
            )}>
              {/* TODO: copy to clipboard */}
              <ShareIcon />
            </div>
            {/* TODO: fix menu */}
            <DropDownMenu
              isRight
              options={[
                {
                  label: 'Duplicate Portfolio',
                  onClick: () => console.log('TODO: will be implement later'),
                },
                {
                  label: 'Save as PDF',
                  onClick: () => console.log('TODO: will be implement later'),
                },
                // TODO: delete function
                { label: 'Delete', onClick: () => console.log(1) },
              ]}
              trigger={
                <div className="is-clickable is-flex mr-20">
                  <OptionsIcon />
                </div>
              }
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="mt-32">
      <div className="is-flex is-justify-content-space-between">
        <p className="title is-size-4">Portfolio Library</p>
        <button
          type="button"
          className="button is-primary"
          onClick={addPortfolio}
        >
          <PlusIcon size="small" />
          <span>Add New Portfolio</span>
        </button>
      </div>
      <Table data={tableData} columns={columns} />
    </div>
  );
};

export default portfolioList;
