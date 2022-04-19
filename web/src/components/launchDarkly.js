// Implements feature flags with LaunchDarkly.
//
// Usage:
//
//   import { useFlags } from 'components/launchDarkly'
//
//   const FooComponent = () => {
//     const { sampleFlag } = useFlags();
//
//     if (sampleFlag)
//       return <Foo/>;
//     else
//       return <Bar/>;
//   }
//
// See also: https://semalab.atlassian.net/l/c/3EqWnXhv
//

import { withLDProvider } from 'launchdarkly-react-client-sdk';
import { useSelector } from 'react-redux';
import { useLDClient } from 'launchdarkly-react-client-sdk';
import { useEffect } from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';

const Component = ({ children }) => {
  const launchDarkly = useLDClient();
  const { authState: { user } } = useSelector(state => state);

  useEffect(() => {
    if (!(user?._id && launchDarkly))
      return;

    const launchDarklyUser = {
      key: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.username
    };

    launchDarkly.identify(launchDarklyUser);
  }, [launchDarkly, user?._id]);

  return (
    <>
    {children}
    </>
  )
}

const LaunchDarkly = withLDProvider({
  clientSideID: process.env.NEXT_PUBLIC_LAUNCHDARKLY_ID,
  // Updating the app in real time makes for a flashy
  // demo, but the UI shifting around without user
  // intervention would be jarring.
  streaming: false
})(Component);

export default LaunchDarkly;

export { useFlags as useFlags };
