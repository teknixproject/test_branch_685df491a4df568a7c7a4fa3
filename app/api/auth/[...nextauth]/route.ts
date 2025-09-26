// api/auth/[...nextauth]/route.ts
import type { NextAuthOptions } from 'next-auth';
import { refreshToken, XHubCredentials, handleCallBack } from 'xhub-auth';
import NextAuth from 'next-auth';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

interface CustomUser {
  accessToken?: string;
  refreshToken?: string;
}

const ssoApi = process.env.NEXT_PUBLIC_SSO_API || '';
// Đảm bảo nextTo không undefined và có giá trị mặc định
// Đảm bảo nextTo không bao giờ undefined
const nextTo = process.env.NEXT_PUBLIC_PATH_TO_NEXT || '/';
const dynamicRedirect = process.env.NEXT_PUBLIC_DYNAMIC_REDIRECT || '';

// Thêm NEXTAUTH_URL vào env variables
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

function decodeToken(token: string) {
  try {
    if (!token) {
      console.warn('No token provided to decode');
      return {};
    }

    const decoded = jwt.decode(token);

    if (decoded && typeof decoded === 'object' && 'exp' in decoded) {
      const expDate = new Date((decoded.exp as number) * 1000);
    }

    return decoded || {};
  } catch (err) {
    console.error('Failed to decode JWT', err);
    return {};
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here', // Bỏ NEXT_PUBLIC_
  // Thêm cấu hình url rõ ràng
  
  providers: [
    XHubCredentials({
      ssoApi: process.env.NEXT_PUBLIC_SSO_API as string || '',
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID || '',
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
    async signIn({ user, account, profile }) {
      return true;
    },
    
    // Thêm redirect callback để kiểm soát redirect
    async redirect({ url, baseUrl }) {
      // Nếu url bắt đầu với baseUrl, return url
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      // Nếu url bắt đầu với "/", return baseUrl + url
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // Default redirect về trang chủ
      return `${baseUrl}${nextTo}`;
    },
    
    jwt: async ({ token, user }) => {
      const now = Math.floor(Date.now() / 1000);

      if (user) {
        token.accessToken = (user as CustomUser).accessToken;
        token.refreshToken = (user as CustomUser).refreshToken;
        return token;
      }

      const { exp } = decodeToken(token?.accessToken as string) as any;

      if (typeof exp === 'number' && now < exp) {
        return token;
      }

      if (token.refreshToken) {
        try {
          const data = await refreshToken(
            token.refreshToken as string,
            process.env.NEXT_PUBLIC_ISSUER || '',
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
  // Thêm debug để xem chi tiết
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export async function GET(request: NextRequest, ctx: any) {
  return handleCallBack(request as any, ctx, handler, ssoApi, nextTo, dynamicRedirect);
}

export async function POST(request: NextRequest, ctx: any) {
  return handler(request, ctx);
}