import clsx from 'clsx';
import { format } from 'date-fns';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OptionsIcon, PlusIcon, ShareIcon } from '../../../../components/Icons';
import DropDownMenu from '../../../../components/dropDownMenu';
import Table from '../../../../components/table';
import Tooltip from '../../../../components/Tooltip';
import { ALERT_TYPES, PATHS, RESPONSE_STATUSES, SEMA_APP_URL } from '../../../../utils/constants';
import DeleteModal from '../../../../components/snapshots/deleteModal';
import { alertOperations } from '../../../../state/features/alerts';
import { portfoliosOperations } from '../../../../state/features/portfolios';
import Toaster from '../../../../components/toaster';

const { triggerAlert, clearAlert } = alertOperations;
const { removePortfolio } = portfoliosOperations;

const portfolioList = () => {
  const dispatch = useDispatch();
  const { portfoliosState, alertsState, authState } = useSelector((state) => state);
  const {
    data: { portfolios },
  } = portfoliosState;
  const { showAlert, alertType, alertLabel } = alertsState;
  const { token } = authState;
  const [copiedToClipboard, setCopiedToClipboard] = useState('');
  const [isDeleteModalOpen, toggleDeleteModal] = useState(false);
  const [activePortfolioId, setActivePortfolioId] = useState(null);
  const addPortfolio = () => {};
  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(`${SEMA_APP_URL}${PATHS.PORTFOLIO.VIEW(id)}`);
    setCopiedToClipboard(id);
  };

  const onDeletePortfolio = async (id) => {
    const payload = await dispatch(removePortfolio(id, token));
    toggleDeleteModal(false);
    if (payload.status === RESPONSE_STATUSES.SUCCESS) {
      dispatch(triggerAlert(`Portfolio was successfully deleted`, ALERT_TYPES.SUCCESS));
    } else {
      dispatch(triggerAlert(`Portfolio was not deleted`, ALERT_TYPES.ERROR));
    }
  };

  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

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
      className: 'p-16 has-text-weight-semibold has-text-black-900',
      Cell: ({ row }) => (
        <Link href={PATHS.PORTFOLIO.VIEW(row.values.id)}>
          <span className="is-clickable has-text-black-900">{row.values.title}</span>
        </Link>
      ),
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
                { 
                  label: 'Delete', 
                  onClick: () => {
                    toggleDeleteModal(true);
                    setActivePortfolioId(row.values.id);
                  }
                },
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
      <DeleteModal
        isModalActive={isDeleteModalOpen}
        toggleModalActive={toggleDeleteModal}
        onSubmit={() => onDeletePortfolio(activePortfolioId)}
      />
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} position="top-right" duration={3000}/>
    </div>
  );
};

export default portfolioList;
