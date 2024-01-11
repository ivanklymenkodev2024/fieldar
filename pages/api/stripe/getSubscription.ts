import type { NextApiRequest, NextApiResponse } from "next";

import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    
  const { subscriptionId } = JSON.parse(req.body);
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  res.status(200).json({ subscription });
}
