import { useSelector } from 'react-redux';
import { StreamApp, NotificationDropdown } from 'react-activity-feed';
import 'react-activity-feed/dist/index.css';

// How to create user tokens: https://getstream.io/activity-feeds/docs/node/auth_and_permissions/?language=javascript#user-tokens

const NotificationFeed = () => {
  const APP_KEY = '';
  const APP_ID = '';
  const auth = useSelector((state) => state.authState);
//   console.log("Header -> auth", auth)
  const USER_TOKEN = auth.notificationsToken;
  return (
    <div style={{ width: '600px', margin: '0 auto' }}>
      <StreamApp
        apiKey={APP_KEY}
        appId={APP_ID}
        token={USER_TOKEN}
      >
          <NotificationDropdown/>
      </StreamApp>
    </div>
  );
};

export default NotificationFeed;
