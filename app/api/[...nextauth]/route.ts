import type { NextAuthOptions } from 'next-auth';
import { refreshToken, XHubCredentials, handleCallBack } from 'xhub-auth';

import NextAuth from 'next-auth';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

interface CustomUser {
  accessToken?: string;
  refreshToken?: string;
}

const ssoApi = process.env.NEXT_PUBLIC_SSO_API || 'https://xhub-sb-be-sso.blocktrend.xyz/v1/api';
const nextTo = process.env.NEXT_PUBLIC_PATH_TO_NEXT || '/';
const dynamicRedirect = process.env.NEXT_PUBLIC_DYNAMIC_REDIRECT || '';

function decodeToken(token: string) {
  try {
    if (!token) {
      console.warn('No token provided to decode');
      return {};
    }

    // Chỉ decode payload mà không verify signature
    const decoded = jwt.decode(token);

    if (decoded && typeof decoded === 'object' && 'exp' in decoded) {
      const expDate = new Date((decoded.exp as number) * 1000);
      // console.log('>>> Token expires at (UTC):', expDate.toUTCString());
      // console.log(
      //   '>>> Token expires at (VN):',
      //   expDate.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
      // );
    }

    return decoded || {};
  } catch (err) {
    console.error('Failed to decode JWT', err);
    return {};
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET || 'your-secret-key-here',
  providers: [
    XHubCredentials({
      issuer: process.env.NEXT_PUBLIC_ISSUER || '',
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID || '',
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || '',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    async signIn() {
      return true;
    },
    jwt: async ({ token, user }) => {
      const now = Math.floor(Date.now() / 1000);

      // Lần đầu sign-in
      if (user) {
        token.accessToken = (user as CustomUser).accessToken;
        token.refreshToken = (user as CustomUser).refreshToken;
        return token;
      }

      const { exp } = decodeToken(token?.accessToken as string) as any;

      // Nếu token còn hạn thì trả về luôn
      if (typeof exp === 'number' && now < exp) {
        return token;
      }

      // Nếu token hết hạn -> refresh
      if (token.refreshToken) {
        try {
          const data = await refreshToken(
            token.refreshToken as string,
            process.env.NEXT_PUBLIC_ISSUER || '',
            process.env.NEXT_PUBLIC_KEYCLOAK_REALM || '',
            process.env.NEXT_PUBLIC_CLIENT_ID || ''
          );

          token.accessToken = data?.access_token;
          token.refreshToken = data?.refresh_token || token.refreshToken;
          return token;
        } catch (error) {
          console.error('Token refresh error:', error);
          return { ...token, error: 'RefreshAccessTokenError' };
        }
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user && token) {
        (session as any).accessToken = token.accessToken;
        (session as any).refreshToken = token.refreshToken;
      }

      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);

export async function GET(request: NextRequest, ctx: any) {
  return handleCallBack(request as any, ctx, handler, ssoApi, nextTo, dynamicRedirect);
}

export async function POST(request: NextRequest, ctx: any) {
  return handler(request, ctx);
}
