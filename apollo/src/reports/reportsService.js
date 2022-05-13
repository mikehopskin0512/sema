import crypto from 'crypto';

import logger from '../shared/logger';
import errors from '../shared/errors';
import { modeOrg, modeEmbedKey, modeEmbedSecret, modeMaxAge } from '../config';
import { delay } from '../shared/utils';
import { getAll, create } from '../shared/apiMode';

// Fetch PDF (if ready)
const requestPDF = async (reportToken, mostRecentReportRunToken, timeout) => {
  if (Date.now() >= timeout) return false; // timeout function
  const endpoint = `/api/${modeOrg}/reports/${reportToken}/exports/runs/${mostRecentReportRunToken}/pdf`;
  const response = await create(endpoint, { trk_source: 'report' });
  if (!response) {
    throw new errors.NotFound('No data returned from API');
  }

  const {
    data: { state = '', filename = '' },
  } = response;
  if (state === 'enqueued') {
    // Request stays in 'enqueued' state until completed
    logger.info('Awaiting PDF generation...');
  } else if (state === 'completed') {
    logger.info('Mode PDF generation completed');
    return { token: mostRecentReportRunToken, reportTitle: filename };
  }

  // Use delay and recursion to poll for 'completed' state from Mode
  await delay(5000);
  return requestPDF(reportToken, mostRecentReportRunToken, timeout);
};

// Generate Mode PDF
export const generatePdf = async (reportToken) => {
  // The following is taken from this (but refactored):
  // https://mode.com/developer/api-cookbook/distribution/export-pdf/
  const endpoint = `/api/${modeOrg}/reports/${reportToken}/runs`;

  try {
    const response = await getAll(endpoint, {});

    if (!response) {
      throw new errors.NotFound('No data returned from API');
    }

    const { data } = response;
    const {
      _embedded: { report_runs: reportRuns = [] },
    } = data;
    const { state, token: mostRecentReportRunToken } = reportRuns[0];

    if (state === 'succeeded' || state === 'enqueued') {
      const timeout = Date.now() + 5 * 60 * 1000; // close the call after 5 min
      const payload = await requestPDF(
        reportToken,
        mostRecentReportRunToken,
        timeout
      );
      return payload;
    }

    return false;
  } catch (err) {
    return err;
  }
};

// Fetches the PDF from Mode that was created above
export const fetchModePdf = async (reportToken, mostRecentReportRunToken) => {
  const endpoint = `/api/${modeOrg}/reports/${reportToken}/exports/runs/${mostRecentReportRunToken}/pdf/download`;

  try {
    const chunks = [];
    getAll(endpoint, { encoding: null }).then((response) => {
      chunks.push(response.data);
    });

    return chunks;
  } catch (err) {
    return err;
  }
};

// Get reports from a Mode space
export const getModeSpace = async (spaceToken) => {
  const endpoint = `api/${modeOrg}/spaces/${spaceToken}/reports?order=asc&order_by=name`;
  const response = await getAll(endpoint, { trk_source: 'report' });

  if (!response) {
    throw new errors.NotFound('No data returned from API');
  }

  const { data } = response;
  const {
    _embedded: { reports },
  } = data;

  return reports;
};

const signUrl = async (url, key, secret, timestamp) => {
  const requestType = 'GET';
  const contentType = null;
  const contentBody = '';
  const contentDigest = crypto
    .createHash('md5')
    .update(contentBody)
    .digest()
    .toString('base64');

  const requestString = [
    requestType,
    contentType,
    contentDigest,
    url,
    timestamp,
  ].join(',');

  const signature = crypto
    .createHmac('sha256', secret)
    .update(requestString)
    .digest('hex');

  const signedUrl = `${url}&signature=${signature}`;
  return signedUrl;
};

export const buildModeReportUri = async (reportId, orgId, urlParams) => {
  const timestamp = Math.floor(new Date() / 1000);
  const reportUrl = `https://modeanalytics.com/semasoftware/reports/${reportId}`;

  // The parameters in the query string must be alphabetically sorted
  // The timestamp and signature params must come after any custom params
  let requestUri = `${reportUrl}/embed?access_key=${modeEmbedKey}&max_age=${modeMaxAge}&param_organization_id=${orgId}`;

  // Add custom urlParams if provided
  if (urlParams) {
    requestUri += `&${urlParams}`;
  }

  // Add timestamp (must come after custom urlParams)
  requestUri += `&timestamp=${timestamp}`;

  // Sign request and add signature to end
  requestUri = await signUrl(
    requestUri,
    modeEmbedKey,
    modeEmbedSecret,
    timestamp
  );

  return requestUri;
};
