import axios from 'axios';
import Rollbar from 'rollbar';
import { environment, rollbarToken } from '../config';

const enabled = process.env.NODE_ENV === 'production' && !process.stdout.isTTY;

const rollbar = new Rollbar({
  accessToken: rollbarToken,
  captureUncaught: enabled,
  captureUnhandledRejections: enabled,
  environment,
  enabled,
});

export default rollbar;

// eslint-disable-next-line no-console
configureRollbarAsync().catch(console.error);

// Adds ECS metadata to Rollbar items.
async function configureRollbarAsync() {
  const ecsMetadataUri = process.env.ECS_CONTAINER_METADATA_URI_V4;
  if (!ecsMetadataUri) return;

  const { data } = await axios.get(ecsMetadataUri);
  const { Labels: labels } = data;
  const simplifiedLabels = Object.keys(labels).reduce(
    (acc, key) => ({
      ...acc,
      [key.replace(/^com\.amazonaws\./, '')]: labels[key],
    }),
    {}
  );

  // Merge ECS labels with the Rollbar payload.
  rollbar.configure({
    payload: simplifiedLabels,
  });
}
