import * as actions from './actions';
import * as analytics from '../../../utils/analytics';

const trackWaitlistAccepted = (userId, properties) => {
  analytics.segmentTrackViaApi(analytics.SEGMENT_EVENTS.WAITLIST_ACCEPTED, userId, properties);
  analytics.segmentTrackViaApi(analytics.SEGMENT_EVENTS.PRODUCT_SIGNUP, userId, properties);
};

export default { ...actions, trackWaitlistAccepted };
