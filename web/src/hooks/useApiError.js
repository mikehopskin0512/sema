import { useEffect, useState } from 'react';
import { onServerError } from '../state/utils/api';

export default function useApiError() {
  const [error, setError] = useState();
  useEffect(() => {
    const cleanup = onServerError(someApiError => setError(someApiError));
    return cleanup;
  }, []);
  return error;
};