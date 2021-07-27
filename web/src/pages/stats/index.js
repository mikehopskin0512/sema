import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const Stats = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  }, [router]);

  return (
    <div className="is-full-height" />
  );
};

export default Stats;
