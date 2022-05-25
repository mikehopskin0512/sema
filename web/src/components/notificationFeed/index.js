import { useSelector, useDispatch } from 'react-redux';
import { StreamApp, NotificationDropdown } from 'react-activity-feed';
import 'react-activity-feed/dist/index.css';
import useAuthEffect from '../../hooks/useAuthEffect';
import { notificationsOperations } from '../../state/features/notifications';
// How to create user tokens: https://getstream.io/activity-feeds/docs/node/auth_and_permissions/?language=javascript#user-tokens

const { fetchNotificationsToken } = notificationsOperations;

const NotificationFeed = () => {
  const APP_KEY = '';
  const APP_ID = '';
//   console.log("Header -> auth", auth)
  const dispatch = useDispatch();
  const auth = useSelector(state => state.authState);
  const { user = {}, token } = auth;
  const { notificationsToken } = useSelector(state => state.notificationsState);
  useAuthEffect(() => {
    dispatch(fetchNotificationsToken(token));
  }, [user, dispatch]);
  return (
    <div style={{ width: '600px', margin: '0 auto' }}>
      {notificationsToken && (
        <StreamApp apiKey={APP_KEY} appId={APP_ID} token={notificationsToken}>
          <NotificationDropdown />
        </StreamApp>
      )}
    </div>
  );
};

export default NotificationFeed;
