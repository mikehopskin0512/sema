import * as types from './types';
import { getReportUrl, getPdfUrl } from './api';

const requestReportUrl = () => ({
  type: types.REQUEST_REPORT_URL,
});

const receiveReportUrl = (data) => ({
  type: types.RECEIVE_REPORT_URL,
  reportUrl: data.requestUri,
});

const requestReportUrlError = (errors) => ({
  type: types.REQUEST_REPORT_URL_ERROR,
  errors,
});

export const fetchReportUrl = (reportId, urlParams, token) => async (dispatch) => {
  dispatch(requestReportUrl());
  const modeReport = await getReportUrl({ reportId, urlParams }, token);
  // const modePdf = await getPdfUrl(token);

  const modePdf = {};
  if (modeReport.error) {
    dispatch(requestReportUrlError(modeReport.error));
  }
  const { data: reportData } = modeReport;
  const { data: pdfData = '' } = modePdf;

  // Send response if report data (not capturing PDF errors)
  if (reportData) {
    dispatch(receiveReportUrl(reportData, pdfData));
  }
};

export const somethingElse = '';
