import * as actions from './actions';
import * as analytics from '../../../utils/analytics';

const trackWaitlistAccepted = (email) => {
  analytics.segmentTrack(analytics.SEGMENT_EVENTS.WAITLIST_ACCEPTED, { email });
  analytics.segmentTrack(analytics.SEGMENT_EVENTS.PRODUCT_SIGNUP, { email });
};

export default { ...actions, trackWaitlistAccepted };
