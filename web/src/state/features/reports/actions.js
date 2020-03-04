import * as types from './types';

import { getAll } from '../../utils/api';

const requestModeUrl = () => ({
  type: types.REQUEST_MODE_URL,
});

const receiveModeUrl = (data) => ({
  type: types.RECEIVE_MODE_URL,
  reportUrl: data.requestUri,
});

const requestModeUrlError = (errors) => ({
  type: types.REQUEST_MODE_URL_ERROR,
  errors,
});

export const getModeUrl = (token) => async (dispatch) => {
  dispatch(requestModeUrl());
  const modeReport = await getAll('/v1/embedded_bi', {}, token);
  //const modePdf = await getAll('/v1/embedded_bi_pdf', {}, token);
  const modePdf = {};
  if (modeReport.error) {
    dispatch(requestModeUrlError(modeReport.error));
  }
  const { data: reportData } = modeReport;
  const { data: pdfData = '' } = modePdf;

  // Send response if report data (not capturing PDF errors)
  if (reportData) {
    dispatch(receiveModeUrl(reportData, pdfData));
  }
};

export const somethingElse = '';
