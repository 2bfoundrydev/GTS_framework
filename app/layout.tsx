'use client';

import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import TopBar from '../components/TopBar';
import ProtectedRoute from '@/contexts/ProtectedRoute';
import { Analytics } from "@vercel/analytics/react"

// PostHog Analytics (Optional Feature - Ready for Future Use)
// Uncomment when you're ready to enable product analytics, session replay, and feature flags
// 1. Get your PostHog key from https://app.posthog.com
// 2. Add NEXT_PUBLIC_POSTHOG_KEY to your .env.local
// 3. Uncomment the imports and providers below
// import { PostHogProvider } from '@/contexts/PostHogContext';
// import { PostHogErrorBoundary } from '@/components/PostHogErrorBoundary';

const geist = Geist({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : ''}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
              document.documentElement.classList.add('dark');
            }
          })();
        `}} />
        <style dangerouslySetInnerHTML={{ __html: `
          body {
            background-color: #ffffff;
            margin: 0;
            padding: 0;
          }
          @media (prefers-color-scheme: dark) {
            body {
              background-color: #111827;
            }
          }
        `}} />
      </head>
      <body className={geist.className}>
        <Analytics mode="auto" />
        {/* <PostHogErrorBoundary>
          <PostHogProvider> */}
            <AuthProvider>   
                <ProtectedRoute>
                  <TopBar />    
                  <main>{children}</main>
                </ProtectedRoute>
            </AuthProvider>
          {/* </PostHogProvider>
        </PostHogErrorBoundary> */}
      </body>
    </html>
  );
}
