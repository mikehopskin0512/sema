import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const useAuthEffect = (func, deps) => {
  const { token } = useSelector((state) => state.authState);

  useEffect(
    () => {
      if(token) {
        func();
      }
    },
    [token, ...deps]
  );
};

export default useAuthEffect;
