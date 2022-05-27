import { useSelector, useDispatch } from 'react-redux';
import { StreamApp, NotificationDropdown, FlatFeed } from 'react-activity-feed';
import 'react-activity-feed/dist/index.css';
import useAuthEffect from '../../hooks/useAuthEffect';
import { notificationsOperations } from '../../state/features/notifications';
import { NotificationCustom, NotificationCustom2 } from './NotificationCustom';

const { fetchNotificationsToken } = notificationsOperations;

const NotificationFeed = () => {
  const APP_KEY = '';
  const APP_ID = '';
  const dispatch = useDispatch();
  const auth = useSelector(state => state.authState);
  const { user = {}, token } = auth;
  const { notificationsToken } = useSelector(state => state.notificationsState);
  useAuthEffect(() => {
    dispatch(fetchNotificationsToken(token));
  }, [user, dispatch]);
  return (
    // style={{ width: '600px', margin: '0 auto' }}
    <div>
      {notificationsToken && (
        <StreamApp apiKey={APP_KEY} appId={APP_ID} token={notificationsToken}>
          <NotificationDropdown
            feedGroup="notification"
            // userId={props.userId}
            notify={true}
            right
            Group={NotificationCustom}
          />
        </StreamApp>
      )}
    </div>
  );
};

export default NotificationFeed;
