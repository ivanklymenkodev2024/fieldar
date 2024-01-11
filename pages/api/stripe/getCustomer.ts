import type { NextApiRequest, NextApiResponse } from "next";

import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { customerId } = JSON.parse(req.body);
  const customer = await stripe.customers.retrieve(customerId);
  res.status(200).json({ customer });
}
