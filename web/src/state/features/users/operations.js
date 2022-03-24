import * as actions from './actions';
import * as analytics from '../../../utils/analytics';

const trackWaitlistAccepted = (email) => {
  analytics.segmentTrack(analytics.SEGMENT_EVENTS.WAITLIST_ACCEPTED, { email });
};

export default { ...actions, trackWaitlistAccepted };
