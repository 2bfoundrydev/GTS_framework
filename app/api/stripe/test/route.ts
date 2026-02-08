import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { withCors } from '@/utils/cors';
import { logger, logStripe } from '@/utils/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GET = withCors(async function GET(request: NextRequest) {
  try {
    logger.info('Testing Stripe connection...');
    logger.debug({ keyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 8) + '...' }, 'Stripe key');
    
    // Just verify the connection works
    await stripe.balance.retrieve();
    logger.info('Stripe connection successful');
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Stripe connection successful',
      keyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 8) + '...'
    });
  } catch (error) {
    logStripe.error('balance_retrieve', error);
    return NextResponse.json({ 
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}); 