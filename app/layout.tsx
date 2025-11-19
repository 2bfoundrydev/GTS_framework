'use client';

import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import TopBar from '../components/TopBar';
import ProtectedRoute from '@/contexts/ProtectedRoute';
import { Analytics } from "@vercel/analytics/react"
// import { PostHogProvider } from '@/contexts/PostHogContext';
// import { PostHogErrorBoundary } from '@/components/PostHogErrorBoundary';

const geist = Geist({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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
