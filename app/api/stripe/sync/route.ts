import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/utils/supabase-admin';
import { withCors } from '@/utils/cors';
import { logStripe } from '@/utils/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const POST = withCors(async function POST(request: NextRequest) {
  try {
    logStripe.webhook('sync_start', {});
    const { subscriptionId } = await request.json();
    
    if (!subscriptionId) {
      logStripe.error('sync', 'No subscription ID provided');
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 });
    }

    // First check if subscription exists in Supabase
    const { data: existingSubscription, error: checkError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('stripe_subscription_id', subscriptionId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      logStripe.error('sync_check', checkError);
      throw checkError;
    }

    // If no subscription exists in database, we need to create it
    if (!existingSubscription) {
      logStripe.webhook('sync_create', { subscriptionId });
      const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      // Get customer details to get user_id
      const customerResponse = await stripe.customers.retrieve(stripeSubscription.customer as string);
      
      if (customerResponse.deleted) {
        logStripe.error('sync_customer', `Customer deleted: ${stripeSubscription.customer}`);
        throw new Error('Invalid customer');
      }

      const customer = customerResponse as Stripe.Customer;
      const userId = customer.metadata?.user_id;

      if (!userId) {
        logStripe.error('sync_metadata', `No user_id for customer: ${customer.id}`);
        throw new Error('No user_id found in customer metadata');
      }

      // Create new subscription record
      const { error: insertError } = await supabaseAdmin
        .from('subscriptions')
        .insert({
          user_id: userId,
          stripe_customer_id: stripeSubscription.customer as string,
          stripe_subscription_id: subscriptionId,
          status: stripeSubscription.status,
          price_id: stripeSubscription.items.data[0]?.price.id,
          current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: stripeSubscription.cancel_at_period_end,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        logStripe.error('sync_insert', insertError);
        throw insertError;
      }
    } else {
      // Update existing subscription
      const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
      const { error: updateError } = await supabaseAdmin
        .from('subscriptions')
        .update({
          status: stripeSubscription.status,
          cancel_at_period_end: stripeSubscription.cancel_at_period_end,
          current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscriptionId);

      if (updateError) {
        logStripe.error('sync_update', updateError);
        throw updateError;
      }
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    logStripe.error('sync', error);
    return NextResponse.json({ 
      error: 'Failed to sync subscription',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}); 