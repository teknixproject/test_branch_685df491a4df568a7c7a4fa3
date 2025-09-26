'use client'

import { useParams } from 'next/navigation';
import React from 'react';
import { XHubRegister } from 'xhub-auth';
import styleRegister from 'xhub-auth/dist/styles/style/register.module.css';

type Props = object;

const RegisterPage: React.FC<Props> = ({}) => {
  const params = useParams();
  const pageAuth = params.pageAuth || [];
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || '';
  const ssoApi = process.env.NEXT_PUBLIC_SSO_API || '';
  return (
    <div
      style={{
        width: '100dvw',
        height: '100dvh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}
    >
      <XHubRegister
        ssoApi={ssoApi}
        clientId={clientId}
        pathToLogin="/login"
        pathToNext="/"
        name="Hii"
        title="Register"
        content="Create an account to continue!"
        style={styleRegister}
        theme={'light'}
      />
    </div>
  );
};

export default RegisterPage;
