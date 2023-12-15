import type { NextApiRequest, NextApiResponse } from "next";

import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    
  const { subscriptionId } = JSON.parse(req.body);
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const invoices = await stripe.invoices.list({
    limit: 10,
  });

  res.status(200).json({ invoices });
}
