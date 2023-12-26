import type { NextApiRequest, NextApiResponse } from "next";

import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { customerId } = JSON.parse(req.body);
  const customer = await stripe.customers.retrieve(customerId);
  console.log(JSON.stringify(customer.address));
  res.status(200).json({ customer });
}
