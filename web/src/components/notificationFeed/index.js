import { useSelector, useDispatch } from 'react-redux';
import { StreamApp, NotificationDropdown, FlatFeed } from 'react-activity-feed';
import 'react-activity-feed/dist/index.css';
import useAuthEffect from '../../hooks/useAuthEffect';
import { notificationsOperations } from '../../state/features/notifications';
import { NotificationCustom } from './NotificationCustom';

const { fetchNotificationsToken } = notificationsOperations;

const NotificationFeed = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.authState);
  const { user = {}, token } = auth;
  const { notificationsToken } = useSelector(state => state.notificationsState);
  useAuthEffect(() => {
    dispatch(fetchNotificationsToken(token));
  }, [user, dispatch]);
  return (
    <>
      {notificationsToken && (
        <StreamApp
          apiKey={process.env.NEXT_PUBLIC_GETSTREAM_APP_KEY}
          appId={process.env.NEXT_PUBLIC_GETSTREAM_APP_ID}
          token={notificationsToken}
        >
          <NotificationDropdown
            feedGroup="notification"
            notify={true}
            right
            Group={NotificationCustom}
          />
        </StreamApp>
      )}
    </>
  );
};

export default NotificationFeed;
