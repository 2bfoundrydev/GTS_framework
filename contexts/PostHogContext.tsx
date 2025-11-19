'use client'

import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect, useState, useMemo } from 'react'
import PostHogPageView from '@/components/PostHogPageView'
import { initPostHog } from '@/utils/posthog'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => {
    if (typeof window === 'undefined') return null
    return initPostHog()
  }, [])

  if (!client) return null

  return (
    <PHProvider client={client}>
      <PostHogPageView />
      {children}
    </PHProvider>
  )
}