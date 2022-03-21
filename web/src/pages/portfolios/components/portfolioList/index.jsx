import clsx from 'clsx';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { OptionsIcon, PlusIcon, ShareIcon } from '../../../../components/Icons';
import DropDownMenu from '../../../../components/dropDownMenu';
import Table from '../../../../components/table';
import Tooltip from '../../../../components/Tooltip';
import { PATHS, SEMA_APP_URL } from '../../../../utils/constants';

const portfolioList = () => {
  const { portfoliosState } = useSelector((state) => state);
  const {
    data: { portfolios },
  } = portfoliosState;
  const [copiedToClipboard, setCopiedToClipboard] = useState('');
  const addPortfolio = () => {};
  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(`${SEMA_APP_URL}${PATHS.PORTFOLIO.VIEW(id)}`);
    setCopiedToClipboard(id);
  };

  const tableData = portfolios.map((portfolio, i) => ({
    // TODO: will be fixed in portfolio name ticket
    title: `Portfolio ${i}`,
    id: portfolio._id,
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
      Header: '',
      accessor: 'id',
      className: 'is-hidden',
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
      // TODO: visibility badge component / will be done in ETCR-1029
      Cell: ({ value }) => <div>{value}</div>,
    },
    {
      Header: '',
      isVisible: false,
      accessor: 'action',
      className: 'pl-20 py-10 has-background-white-50',
      Cell: ({ row }) => {
        const isPublic = row.values.type === 'public';
        const isCopiedToClipboard = copiedToClipboard === row.values.id;
        const tooltipText = {
          private: 'If you want to share, please change status to "Public”.',
          public: isCopiedToClipboard ? 'Copied to clipboard' : 'Click to copy to clipboard',
        };
        return (
          <div className="is-flex is-justify-content-flex-end has-text-gray-600">
            <Tooltip text={isPublic ? tooltipText.public : tooltipText.private}>
              <div
                onClick={() => isPublic && copyToClipboard(row.values.id)}
                className={clsx(
                  'is-flex mr-24',
                  isPublic ? 'is-cursor-pointer' : 'has-text-gray-300',
                )}
              >
                <ShareIcon />
              </div>
            </Tooltip>
            <DropDownMenu
              isRight
              options={[
                {
                  // TODO: add Duplicate - ETCR-1030
                  label: 'Duplicate Portfolio',
                  onClick: () => console.log('TODO: will be implement later'),
                },
                {
                  // TODO: add Save as PDF ETCR-688
                  label: 'Save as PDF',
                  onClick: () => console.log('TODO: will be implement later'),
                },
                // TODO: add delete function ETCR-1044
                { label: 'Delete', onClick: () => console.log(1) },
              ]}
              trigger={
                <div className="is-clickable is-flex mr-24">
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
          <PlusIcon />
          <span className="ml-16 has-text-weight-semibold">Add New Portfolio</span>
        </button>
      </div>
      <Table
        minimal
        className="overflow-unset shadow-none"
        data={tableData}
        columns={columns}
      />
    </div>
  );
};

export default portfolioList;
