import fileSaver from '../../utils/fileSaver';
import * as types from './types';
import { getReportUrl, getReportList, getRunToken, getPdfFile } from './api';

const requestReportUrl = () => ({
  type: types.REQUEST_REPORT_URL,
});

const receiveReportUrl = (reportId, reportData) => ({
  type: types.RECEIVE_REPORT_URL,
  reportId,
  reportUrl: reportData.requestUri,
});

const receiveRunToken = (runToken, reportTitle) => ({
  type: types.RECEIVE_REPORT_RUN_TOKEN,
  runToken,
  reportTitle,
});

const requestReportUrlError = (errors) => ({
  type: types.REQUEST_REPORT_URL_ERROR,
  errors,
});

const requestReportList = () => ({
  type: types.REQUEST_REPORT_LIST,
});

const receiveReportList = (reportList) => ({
  type: types.RECEIVE_REPORT_LIST,
  reportList,
});

const requestReportListError = () => ({
  type: types.REQUEST_REPORT_LIST_ERROR,
});

const requestDownload = () => ({
  type: types.REQUEST_DOWNLOAD,
});

const receiveDownload = () => ({
  type: types.RECEIVE_DOWNLOAD,
});

const requestDownloadError = () => ({
  type: types.REQUEST_DOWNLOAD_ERROR,
});

export const fetchReportUrl = (reportId, urlParams, token) => async (dispatch) => {
  dispatch(requestReportUrl());
  const modeReport = await getReportUrl({ reportId, urlParams }, token);
  const { data: reportData } = modeReport;

  // Send response if report data
  if (reportData) {
    dispatch(receiveReportUrl(reportId, reportData));
  }

  const modeReportRun = await getRunToken(reportId, token);
  const { data: { token: runToken, reportTitle } } = modeReportRun;

  if (modeReportRun) {
    dispatch(receiveRunToken(runToken, reportTitle));
  }

  if (modeReport.error) {
    dispatch(requestReportUrlError(modeReport.error));
  }
};

export const fetchReportList = (spaceId, token) => async (dispatch) => {
  try {
    dispatch(requestReportList());
    const response = await getReportList(spaceId, token);
    dispatch(receiveReportList(response.data));
  } catch (err) {
    dispatch(requestReportListError(err.response));
  }
};

export const downloadPdf = (reportId, reportTitle, runToken, token) => async (dispatch) => {
  try {
    dispatch(requestDownload());
    const { data } = await getPdfFile(reportId, runToken, token);
    const file = new Blob([data], { type: 'application/pdf' });

    await fileSaver(file, reportTitle);

    dispatch(receiveDownload());
  } catch (err) {
    dispatch(requestDownloadError(err.response));
  }
};

export const somethingElse = '';
