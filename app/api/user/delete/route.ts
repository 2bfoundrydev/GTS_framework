import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/utils/supabase-admin';
import { withCors } from '@/utils/cors';
import { logger } from '@/utils/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const DELETE = withCors(async function DELETE(request: NextRequest) {
  let userId: string | null = null;
  
  try {
    const { searchParams } = new URL(request.url);
    userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    logger.info({ userId }, 'Starting account soft-deletion');

    // 1. Cancel Stripe subscriptions if they exist
    const { data: subscriptionsData, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_subscription_id, status')
      .eq('user_id', userId);

    if (subError) {
      logger.error({ userId, error: subError }, 'Subscription fetch error');
    } else if (subscriptionsData) {
      for (const sub of subscriptionsData) {
        if (sub.stripe_subscription_id && (sub.status === 'active' || sub.status === 'trialing')) {
          try {
            await stripe.subscriptions.cancel(sub.stripe_subscription_id);
            logger.info({ subscriptionId: sub.stripe_subscription_id }, 'Stripe subscription cancelled');
          } catch (stripeError) {
            logger.error({ subscriptionId: sub.stripe_subscription_id, error: stripeError }, 'Stripe cancellation error');
          }
        }
      }
    }

    // 2. Soft delete the profile
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .update({ 
        deleted_at: new Date().toISOString(),
        is_deleted: true
      })
      .eq('id', userId);

    if (profileError) {
      logger.error({ userId, error: profileError }, 'Profile update error');
      return NextResponse.json(
        { error: 'Failed to update profile', details: profileError },
        { status: 500 }
      );
    }

    // 3. Mark subscriptions as canceled
    const { error: subscriptionUpdateError } = await supabaseAdmin
      .from('subscriptions')
      .update({
        deleted_at: new Date().toISOString(),
        status: 'canceled'
      })
      .eq('user_id', userId);

    if (subscriptionUpdateError) {
      logger.error({ userId, error: subscriptionUpdateError }, 'Subscription update error');
    }

    logger.info({ userId }, 'Account soft-deletion completed successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error({ userId, error }, 'Error in account soft-deletion');
    return NextResponse.json(
      { 
        error: 'Failed to process account deletion', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}); 