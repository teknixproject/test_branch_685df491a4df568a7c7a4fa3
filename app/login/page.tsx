'use client'

import { useParams } from 'next/navigation';
import React from 'react';
import { XHubLogin } from 'xhub-auth';
import styleLogin from 'xhub-auth/dist/styles/style/login.module.css';

type Props = object;

const LoginPage: React.FC<Props> = ({}) => {
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
      }}
    >
      <XHubLogin
        ssoApi={ssoApi}
        clientId={clientId}
        pathRegister="/register"
        pathToNext="/abc"
        name="Hii"
        title="Welcome Back!"
        content="Enter your email and password to login"
        pathForgotPassword="/forgot-password"
        style={styleLogin}
      />
    </div>
  );
};

export default LoginPage;
