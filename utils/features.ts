/**
 * Feature Flags Configuration
 * 
 * These flags control optional SaaS core features.
 * Set them in .env.local to enable/disable functionality.
 */

// Feature flags with defaults
export const FEATURES = {
  // Billing & Subscriptions (Stripe integration)
  BILLING: process.env.NEXT_PUBLIC_ENABLE_BILLING !== 'false', // enabled by default
  
  // Trial periods for new users
  TRIALS: process.env.NEXT_PUBLIC_ENABLE_TRIALS !== 'false', // enabled by default
  
  // Onboarding tour and preferences
  ONBOARDING: process.env.NEXT_PUBLIC_ENABLE_ONBOARDING !== 'false', // enabled by default
} as const;

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof FEATURES): boolean {
  return FEATURES[feature];
}

/**
 * Get all enabled features
 */
export function getEnabledFeatures(): string[] {
  return Object.entries(FEATURES)
    .filter(([, enabled]) => enabled)
    .map(([feature]) => feature);
}

/**
 * Check if all core SaaS features are enabled
 */
export function isFullSaaSMode(): boolean {
  return FEATURES.BILLING && FEATURES.TRIALS && FEATURES.ONBOARDING;
}
