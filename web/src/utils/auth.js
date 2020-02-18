import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Router from 'next/router';
import nextCookie from 'next-cookies';
import cookie from 'js-cookie';
import jwtDecode from 'jwt-decode';

export const auth2 = (ctx) => {
  const { sema_token: token } = nextCookie(ctx);
console.log('auth - token: ', token);
const test = cookie.get('sema_token');
console.log(test);
  // If there's no token, it means the user is not logged in.
  if (!token) {
    if (typeof window === 'undefined') {
      ctx.res.writeHead(302, { Location: '/login' });
      ctx.res.end();
    } else {
      Router.push('/login');
    }
  }

  return token;
};


export const withAuthSync = (WrappedComponent) => {

  console.log('withAuthSync');
  const Wrapper = (props) => {
    const dispatch = useDispatch();

    const { auth } = useSelector(
      (state) => ({
        auth: state.auth,
      }),
    );
    console.log('auth2: ', auth);

    const { token = null } = props;
    console.log('props: ', props);

var decoded = jwtDecode(props.token);
console.log('decoded: ', decoded);    
/*    const syncLogout = (event) => {
      if (event.key === 'logout') {
        console.log('logged out from storage!');
        Router.push('/login');
      }
    };


    useEffect(() => {
      window.addEventListener('storage', syncLogout);

      return () => {
        window.removeEventListener('storage', syncLogout);
        window.localStorage.removeItem('logout');
      };
    }, []);*/

    return <WrappedComponent {...props} />;
  };

  Wrapper.getInitialProps = async (ctx) => {
    const token = auth2(ctx);
console.log('getInitialProps');
console.log('ctx: ', ctx);
console.log('token: ', token);
    const componentProps =
      WrappedComponent.getInitialProps &&
      (await WrappedComponent.getInitialProps(ctx));

    return { ...componentProps, token };
  };

  return Wrapper;
};
