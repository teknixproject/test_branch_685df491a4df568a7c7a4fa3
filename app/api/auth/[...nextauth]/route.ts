import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import { handleCallBack, refreshToken, XHubCredentials } from 'xhub-auth';
import { NextRequest as NextAuthNextRequest } from 'xhub-auth/node_modules/next/dist/server/web/spec-extension/request';

interface CustomUser {
  accessToken?: string;
  refreshToken?: string;
}
const ssoApi = process.env.NEXT_PUBLIC_SSO_API || 'https://xhub-sb-be-sso.blocktrend.xyz/v1/api';
const nextTo = process.env.NEXT_PUBLIC_PATH_TO_NEXT || '/';
const dynamicRedirect = process.env.NEXT_PUBLIC_DYNAMIC_REDIRECT || '';
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
  providers: [
    XHubCredentials({
      ssoApi: process.env.NEXT_PUBLIC_SSO_API || '',
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID || '',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    jwt: async ({ token, user, trigger }) => {
      if (user) {
        token.accessToken = (user as CustomUser).accessToken;
        token.refreshToken = (user as CustomUser).refreshToken;
      }

      if (trigger === 'update' && token.refreshToken) {
        try {
          const data = await refreshToken(
            token.refreshToken as string,
            process.env.NEXT_PUBLIC_SSO_API || '',
            process.env.NEXT_PUBLIC_CLIENT_ID || ''
          );
          token.accessToken = data?.access_token;
          token.refreshToken = data?.refresh_token;
        } catch (error) {
          console.error('Token refresh error:', error);
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
  debug: true,
};

const handler = NextAuth(authOptions);

export async function GET(request: NextAuthNextRequest, ctx: any) {
  const url = request.url;
  const searchParams = new URL(url).searchParams;
  const dynamicRedirect = searchParams.get('dynamicRedirect');

  return handleCallBack(
    request,
    ctx,
    handler,
    process.env.NEXT_PUBLIC_SSO_API || '',
    dynamicRedirect || '/', // nếu không dùng thì để trang mặc định quay về
    dynamicRedirect || '' // Để mặc định nhưu vậy
  );
}

export async function POST(request: NextAuthNextRequest, ctx: any) {
  return handler(request, ctx);
}
