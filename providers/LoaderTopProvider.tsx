'use client';
import NextTopLoader from 'nextjs-toploader';
import React from 'react';

type Props = object;

const LoaderTopProvider: React.FC<Props> = ({ children }) => {
  return (
    <>
      <NextTopLoader />
      {children}
    </>
  );
};

export default LoaderTopProvider;
