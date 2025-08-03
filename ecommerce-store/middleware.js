import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/category/(.*)',
    '/product/(.*)',
    '/search',
    '/api/(.*)',
    '/cart'
  ],
  ignoredRoutes: [
    '/api/webhooks/(.*)',
    '/_next/(.*)',
    '/favicon.ico'
  ]
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
