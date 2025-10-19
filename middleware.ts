import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/',
    '/events/:id',
    '/api/webhook/clerk',
    '/api/uploadthing',
    '/((?!_next|api/webhook/stripe|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)((?!webhook/stripe).*)',
  ],
};